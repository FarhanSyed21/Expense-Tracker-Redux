import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./store";
import listDataReducer from "./listData";

const rootReducer = combineReducers({
  auth: authReducer,
  listData: listDataReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
