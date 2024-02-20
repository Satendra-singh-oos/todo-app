import { useDispatch } from "react-redux";
import { userLogout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    const response = await dispatch(userLogout());
    if (!response) {
      alert("Some Thing Went Wrong Try Again");
    }
    alert("Logout Succesfully");
    navigate("/login");
  };

  return (
    <>
      <button
        className="px-6 inline-block py-2 duration-200 hover:bg-blue-100 rounded-full"
        onClick={logoutHandler}
      >
        Logout
      </button>
    </>
  );
};

export default LogoutBtn;
