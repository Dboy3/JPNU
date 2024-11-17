import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, resetError } from './user';

const SignupPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const onSubmit = (data) => {
    console.log(data);
    
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    dispatch(signupUser(data));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex md:w-1/3 bg-gradient-to-r from-primary-dark to-primary-darker items-center justify-center text-white text-4xl font-extrabold p-6 lg:p-10">
        <div className="text-center">
          <h1>MyJobPortal</h1>
          <p className="mt-4 text-lg">Join us and make an impact</p>
        </div>
      </div>
      <div className="w-full md:w-2/3 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 mt-5 h-full max-h-screen overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Sign Up</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              />
              {errors.firstName && <span className="text-red-500">{errors.firstName.message}</span>}
            </div>

            {/* Middle Name */}
            <div>
              <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">Middle Name</label>
              <input
                id="middleName"
                type="text"
                {...register('middleName')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              />
              {errors.lastName && <span className="text-red-500">{errors.lastName.message}</span>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              />
              {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                {...register('phoneNumber', { required: 'Phone number is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              />
              {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber.message}</span>}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                {...register('role', { required: 'Role is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              >
                <option value="">Select a role</option>
                <option value="SPC">SPC</option>
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
                <option value="Academic Coordinator">Academic Coordinator</option>
              </select>
              {errors.role && <span className="text-red-500">{errors.role.message}</span>}
            </div>

            {/* Roll Number (Optional) */}
            {watch('role') === 'Student' && (
              <div>
                <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700">Roll Number</label>
                <input
                  id="rollNo"
                  type="text"
                  {...register('rollNo')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              />
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', { required: 'Confirm password is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              />
              {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg mt-4"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
