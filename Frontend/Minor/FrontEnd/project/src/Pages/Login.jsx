import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkUser, selectUser, userError, userMessage } from "./auth";

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUser = useSelector(selectUser);
  const loginError = useSelector(userError);
  const loginMessage = useSelector(userMessage);

  const onSubmit = (data) => {
    dispatch(checkUser(data)); 
  };

  useEffect(() => {
    if (loginMessage === "Login successful") {
      console.log(loggedInUser);
      navigate("/");  
    }
  }, [loginMessage, navigate]);

  // Function to navigate to signup page
  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:flex md:w-1/3 bg-gradient-to-r from-primary-dark to-primary-darker items-center justify-center text-white text-4xl font-extrabold p-10">
        <div className="text-center">
          <h1>MyJobPortal</h1>
          <p className="mt-4 text-lg">Your gateway to opportunities</p>
        </div>
      </div>
      <div className="w-full md:w-2/3 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Enter your email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
              {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                {...register("password", { required: "Password is required" })}
                placeholder="Enter your password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
              {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
            </div>
            <button type="submit" className="w-full py-3 px-4 bg-primary-dark text-white rounded-md hover:bg-primary-darker focus:outline-none focus:ring-2 focus:ring-primary-light">
              Login
            </button>
          </form>

          {/* Success Message Popup */}
          {loginMessage && loginMessage === "Login successful" && (
            <div className="mt-4 p-4 bg-green-500 text-white rounded-md">
              {loginMessage}
            </div>
          )}

          {/* Error Message Popup */}
          {loginError && (
            <div className="mt-4 p-4 bg-red-500 text-white rounded-md">
              {loginError}
            </div>
          )}

          {/* New User Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleSignupRedirect}
              className="text-primary-dark hover:underline"
            >
              New User? Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
