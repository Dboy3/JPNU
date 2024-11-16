import { configureStore } from "@reduxjs/toolkit";
import formReducer from "../FormTesting/formSlice";
// import reducer from '../Pages/auth';
import authReducer from "../Pages/auth";
import userReducer from "../Pages/user";
import jobPostReducer from "../Components/AdminDashboard/JobPost/jobPostSlice";
import expenseReducer from "../Components/SPC/expenseSlice";
import notificationReducer from "../Components/AdminDashboard/AddNotification/notificationSlice"
import jobApplicationReducer from "../Components/WithinDashboard/Jobs/JobCategories/jobApplicationSlice" 
import placedStudentsReducer from "../Components/AdminDashboard/History/placedStudentsSlice"

import jobReducer from "../Components/WithinDashboard/Jobs/jobSlice"

const store = configureStore({
  reducer: {
    form: formReducer,
    auth: authReducer,
    user: userReducer,
    expenses: expenseReducer,
    jobposts: jobPostReducer,
    expenses : expenseReducer,
    notifications : notificationReducer,
    jobApplication : jobApplicationReducer,
    placedStudents : placedStudentsReducer,

    jobs : jobReducer
  },
});

export default store;
