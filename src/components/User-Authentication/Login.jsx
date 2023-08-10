import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { authActions } from "../reduxStore/store";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please provide both email and password.");
      return;
    }

    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCrHf6mBaugVBBp3iRU03PWKO624o9NFQQ",
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(
          authActions.login({
            email: data.email,
            token: data.idToken
          })
        );
        navigate("/expenses");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
      }
    } catch (error) {
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
    }
  };

  const handleForget = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCrHf6mBaugVBBp3iRU03PWKO624o9NFQQ`;

      const requestData = {
        requestType: "PASSWORD_RESET",
        email: email
      };

      const response = await axios.post(apiUrl, requestData);
      toast.success("Please check your email to reset the password.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
    } catch (error) {
      toast.error("Please enter a valid email.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
    }
  };

  return (
    <div className="login-container">
      <form className="form-container" onSubmit={handleSubmit}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <br />
        <label htmlFor="email">Email Id</label>
        <input
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <div className="password-input-container">
          <input
            type={passwordVisible ? "text" : "password"}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="password-toggle-icon"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>
        <div className="buttons-container">
          <button type="submit">Log In</button>
        </div>
        <br />
        <a href="">
          <p onClick={handleForget}>Forget Password</p>
        </a>
      </form>
      <div className="dont-have-account">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
      <ToastContainer />
    </div>
  );
};
export default Login;
