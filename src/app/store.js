import { combineReducers, configureStore } from "@reduxjs/toolkit";
import listReducer from "../components/common/listSlice";

export default configureStore({
  reducer: {
    lists: listReducer,
  },
});
