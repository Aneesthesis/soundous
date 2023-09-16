import { useContext, useState } from "react";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export function ProfileScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  function formSubmitHandler() {}

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Helmet>User Profile</Helmet>
      <h1 className="text-3xl mb-4">Your Profile</h1>
      <form
        onSubmit={formSubmitHandler}
        className="w-[80%] md:max-w-md mx-auto p-4 border rounded-md shadow-lg"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Edit Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border rounded-md px-4 py-2 w-full focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Edit Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded-md px-4 py-2 w-full focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="border rounded-md px-4 py-2 w-full focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="confirmNewPassword" className="block text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            className="border rounded-md px-4 py-2 w-full focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-yellow-500 border-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
