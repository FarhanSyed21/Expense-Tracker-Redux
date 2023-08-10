import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import context from "react-bootstrap/esm/AccordionContext";

export const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const initialToken = localStorage.getItem("token");
  const initialEmail = localStorage.getItem("email");
  const userIsLoggedIn = !!initialToken;
  const [user, setUser] = useState(null);
  const [addedValues, setAddedValues] = useState([]);
  const [id, setId] = useState(null);
  const contextValue = {
    user,
    token: initialToken,
    email: initialEmail,
    userAuth: userIsLoggedIn,
    logIn: loginHandler,
    logOut: logoutHandler,
    setUser,
    expenses: addedValues,
    newExpense: addExpense,
    deleteExpense: removeExpense,
    editingId: id,
    editingExpense: expenseEdit,
    RemoveId: removeExpenseEdit
  };

  function loginHandler(email, token) {
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
  }

  function logoutHandler() {
    localStorage.clear();
  }

  function addExpense(expense) {
    const existingExpense = addedValues.find((exp) => exp.id === expense.id);
    if (existingExpense) {
    } else {
      const updatedExpenses = addedValues.concat(expense);
      setAddedValues(updatedExpenses);
    }
  }

  function removeExpense(id) {
    const updatedExpenses = addedValues.filter((expense) => expense.id !== id);
    setAddedValues(updatedExpenses);
  }

  function expenseEdit(editingId) {
    setId(editingId);
  }

  function removeExpenseEdit() {
    setId(null);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider value={contextValue}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}

export function useAddedValues() {
  return useUserAuth().addedValues;
}
