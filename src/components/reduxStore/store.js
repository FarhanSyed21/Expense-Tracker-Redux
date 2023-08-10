import { createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem("token");
const initialEmail = localStorage.getItem("email");
const userIsLoggedIn = !!initialToken;

const initialAuthState = {
  token: initialToken,
  email: initialEmail,
  isAuthenticated: userIsLoggedIn
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      const { token, email } = action.payload;
      state.token = token;
      state.email = email;
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
    },

    logout(state) {
      state.token = null;
      state.email = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("premiumUser");
    },

    signup(state, action) {
      const { token, email } = action.payload;
      state.token = token;
      state.email = email;
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
    },

    updateProfile(state, action) {
      const { fullName, profilePhotoURL } = action.payload;
      state.fullName = fullName;
      state.profilePhotoURL = profilePhotoURL;
    }
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
