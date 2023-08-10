import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../reduxStore/store";
import "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.email);
  const userToken = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    navigate("/profile");
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCrHf6mBaugVBBp3iRU03PWKO624o9NFQQ`,
      {
        method: "POST",
        body: JSON.stringify({
          requestType: "VERIFY_EMAIL",
          idToken: userToken
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
      .then((res) => {
        if (res.ok) {
          toast.success("Verification link sent to email!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
          });
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data.error.message);
          });
        }
      })
      .catch((error) => {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
      });
  };

  return (
    <nav className="expenses-navbar">
      <h1 className="expenses-header">Expense Tracker</h1>
      <div className="expense-verifyEmail">
        <a href="">
          <p onClick={handleVerifyEmail}>
            <FaEnvelope className="icon" /> Verify Email
          </p>
        </a>
      </div>
      <button className="expenses-button" onClick={handleLogout}>
        <FaSignOutAlt className="icon" />
        Logout
      </button>
      <ToastContainer />
    </nav>
  );
};
export default Navbar;
