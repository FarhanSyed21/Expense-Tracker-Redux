import SignUp from "./components/User-Authentication/SignUp";
import "./styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/User-Authentication/Login";
import { useSelector } from "react-redux";
import AddExpenses from "./components/Expenses/AddExpenses";
import { Navigate } from "react-router-dom";

export default function App() {
  const userIsLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={!userIsLoggedIn && <Login />} />
          <Route path="/signup" element={!userIsLoggedIn && <SignUp />} />
          <Route path="/expenses" element={userIsLoggedIn && <AddExpenses />} />

          <Route
            path="*"
            element={userIsLoggedIn && <Navigate to="/expenses" replace />}
          />
          <Route
            path="*"
            element={!userIsLoggedIn && <Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
