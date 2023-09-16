import { Link } from "react-router-dom";

export const OptionsModal = (props) => {
  <div className="small-container absolute top-10 mx-auto">
    <ul>
      <Link to={"/profile"}>User Profile</Link>
      <Link to={"/history"}>Order History</Link>
      <Link onClick={() => props.signoutHandler()} to={"/#signout"}>
        Sign Out
      </Link>
    </ul>
  </div>;
};
