import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  applicationList: [],
  loading: false,
  error: null,
};

export const applyForJob = createAsyncThunk(
  "jobApplication/applyForJob",
  async (jobData) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/jobs/addApplication",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(jobData),
        }
      );

      // Check if the response is okay
      if (!response.ok) {
        throw new Error("Failed to apply for the job");
      }

      const data = await response.json(); // The returned job object from the backend
      return data; // This will be the payload for the fulfilled action
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors and pass them to the rejected action
    }
  }
);

export const getApplicationsByUserId = createAsyncThunk(
  "jobApplication/getApplicationByUserId",
  async (obj) => {
    const response = await fetch(
      "http://localhost:8000/api/jobs/getApplications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(obj),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add job post");
    }
    const data = await response.json();
    return data.jobDetails;
  }
);

// Create the slice using createSlice
const jobApplicationSlice = createSlice({
  name: "jobApplication",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(applyForJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false;
        // state.applicationList.push(action.payload.job);
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getApplicationsByUserId.fulfilled, (state, action) => {
        state.applicationList = action.payload;
        state.error = action.payload;
      });
  },
});


export default jobApplicationSlice.reducer;
export const getApplicationsList = (state) =>
  state.jobApplication.applicationList;
