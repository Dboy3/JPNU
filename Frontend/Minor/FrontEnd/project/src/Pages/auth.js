import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loggedInUser: null,
  status: "idle",
  error: null,
  message: null, // Field to store success/error message
};

// Action creator for login
export const checkUser = createAsyncThunk(
  "auth/checkuser",
  async (userObj, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8000/api/user/login", {
        method: "POST",
        body: JSON.stringify(userObj),
        headers: { "content-type": "application/json" },
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();
        // Store the token in local storage
        //   localStorage.setItem("token", data.token);
        console.log(data, " printing the data");
        return data; // Return success data
      } else {
        const errorData = await response.json();
        return rejectWithValue(errorData.error); // Return error message
      }
    } catch (err) {
      return rejectWithValue("Something went wrong. Please try again.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUser.pending, (state) => {
        state.status = "loading";
        state.error = null; // Reset errors on new login attempt
        state.message = null; // Reset message
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUser = action.payload.user; // Store user data on successful login
        state.message = "Login successful"; // Store success message
        state.error = null; // Reset error
        console.log("the user is ",state.loggedInUser);
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload; // Capture error message from API response
        state.message = null; // Reset success message on error
      });
  },
});

export default authSlice.reducer;
export const selectUser = (state) => state.auth.loggedInUser;
export const userError = (state) => state.auth.error;
export const userMessage = (state) => state.auth.message;
