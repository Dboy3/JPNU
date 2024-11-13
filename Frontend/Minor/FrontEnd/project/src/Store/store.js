import { configureStore } from '@reduxjs/toolkit';
import formReducer from "../FormTesting/formSlice"
// import reducer from '../Pages/auth';
import authReducer from "../Pages/auth";
import userReducer from "../Pages/user";
import expenseReducer from "../Components/SPC/expenseSlice"

const store = configureStore({
  reducer: {
    form: formReducer,
    auth : authReducer , 
    user : userReducer , 
    expenses : expenseReducer ,
  },
});

export default store;
