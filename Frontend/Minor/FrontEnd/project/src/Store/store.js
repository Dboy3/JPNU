import { configureStore } from "@reduxjs/toolkit";
import formReducer from "../FormTesting/formSlice";
// import reducer from '../Pages/auth';
import authReducer from "../Pages/auth";
import userReducer from "../Pages/user";
import jobPostReducer from "../Components/AdminDashboard/JobPost/jobPostSlice";
import expenseReducer from "../Components/SPC/expenseSlice";
import notificationReducer from "../Components/AdminDashboard/AddNotification/notificationSlice"

const store = configureStore({
  reducer: {
    form: formReducer,
    auth: authReducer,
    user: userReducer,
    expenses: expenseReducer,
    jobposts: jobPostReducer,
    expenses : expenseReducer,
    notifications : notificationReducer
  },
});

export default store;
