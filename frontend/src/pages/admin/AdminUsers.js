import React, { useContext, useEffect, useReducer } from "react";
import { Store } from "../../Store";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../../utils/getError";
import { Link, useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQ":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "", data: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_ADMIN":
      return {
        ...state,
        loading: false,
        data: state.data.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      };
    case "UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        data: state.data.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      };

    default:
      return state;
  }
};

function AdminUsers() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, data, error }, dispatch] = useReducer(reducer, {
    loading: false,
    data: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQ" });
        const { data } = await axios.get(`/api/users`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
        toast.error(getError(error));
      }
    };
    fetchData();
  }, [dispatch, state]);

  const toggleAdminStatus = async (user) => {
    try {
      const response = await axios.put(
        `/api/admin/users/${user._id}/toggle-admin`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (response.status === 200) {
        dispatch({ type: "UPDATE_ADMIN", payload: response.data.user });
        toast.success(
          `${
            user.isAdmin
              ? `${user.name} is not an Admin now`
              : `${user.name} is now an Admin`
          }`
        );
        navigate(`/admin-userlist`);
      } else {
        toast.error("Failed to update Admin status");
      }
    } catch (error) {
      toast.error(getError(error));
    }
  };

  async function updateUserIsDeactivated(user) {
    try {
      const { data } = await axios.patch(
        `/api/admin/users/${user._id}`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: "UPDATE_SUCCESS", payload: data.user });
      toast.success(
        `User ${!user.isDeactivated ? "marked as deactivated" : "restored"}`
      );
    } catch (error) {
      toast.error("Failed to update user's state");
    }
  }

  return (
    <div className="dashboard flex">
      <section className="hidden md:block left w-1/4 p-4">
        <div className="menu-card bg-white rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">Dashboard Menu</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin-orderlist"
                className="text-blue-500 hover:underline"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/admin-productlist"
                className="text-blue-500 hover:underline"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/admin-userlist"
                className="text-blue-500 hover:underline"
              >
                Users
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="overflow-x-auto w-full md:w-3/4 p-4">
        <h1 className="mb-4 text-xl">Admin Users</h1>
        {loading ? (
          <div>Loaddata...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">ID</th>
                  <th className="px-5 text-left">Name</th>
                  <th className="px-5 text-left">Email</th>
                  <th className="px-5 text-left">Admin</th>
                  <th className="px-5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="p-5">{user._id.substring(20, 24)}</td>
                    <td className="p-5">{user.name}</td>
                    <td className="p-5">{user.email}</td>
                    <td className="p-5">
                      <input
                        type="checkbox"
                        checked={user.isAdmin}
                        onChange={() => toggleAdminStatus(user)}
                      />
                    </td>
                    <td className="p-5">
                      <button
                        onClick={() => updateUserIsDeactivated(user)}
                        className={`rounded-md w-[100px] text-white px-1 py-2 ${
                          !user.isDeactivated ? "bg-orange-500" : "bg-green-500"
                        }`}
                      >
                        {!user.isDeactivated ? "Deactivate" : "Restore"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminUsers;
