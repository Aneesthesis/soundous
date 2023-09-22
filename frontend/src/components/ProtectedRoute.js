import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../Store";

export function ProtectedRoute({ children }) {
  const { state } = useContext(Store);
  return state.userInfo ? children : <Navigate to="/signin" />;
}
