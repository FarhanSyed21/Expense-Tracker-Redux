import { useState } from "react";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import signup, { authActions } from "../reduxStore/store.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // alert("PASSWORD_NOT_MATCH");
      toast.error("PASSWORD_NOT_MATCH", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
      return;
    }

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCrHf6mBaugVBBp3iRU03PWKO624o9NFQQ",
      {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    )
      .then((res) => {
        if (res.ok) {
          navigate("/");
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data.error.message);
          });
        }
      })
      .then((data) => {
        toast.success("Your new account is created", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light"
        });
      })
      .catch((err) => {
        alert(err.message);
        setErrorMessage(err.message);
      });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prevVisible) => !prevVisible);
  };

  return (
    <div className="signup-container">
      <form className="form-container" onSubmit={handleSignUp}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <br />
        <label htmlFor="email">Email Id</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <div className="password-input-container">
          <input
            type={passwordVisible ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="password-toggle-icon"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>
        <label htmlFor="confirm-password">Confirm Password</label>
        <div className="password-input-container">
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div
            className="password-toggle-icon"
            onClick={toggleConfirmPasswordVisibility}
          >
            {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>
        <button type="submit">Sign up</button>
        <br />
      </form>
      <div className="already-have-account">
        Already have an account? <Link to="/">Log In</Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
