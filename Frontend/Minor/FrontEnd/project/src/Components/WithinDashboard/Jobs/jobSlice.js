import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch opportunities
export const fetchOpportunities = createAsyncThunk(
  "jobs/fetchOpportunities",
  async (obj) => {
    const response = await fetch("http://localhost:8000/api/jobs/getposts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(obj),
    });
    const data = await response.json();
    console.log(data);
    return data.jobPostings;
  }
);

// Async thunk to fetch existing applications
export const fetchApplications = createAsyncThunk(
  "jobs/fetchApplications",
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

// Async thunk to apply for a job
export const applyForJob = createAsyncThunk(
  "jobs/applyForJob",
  async (jobId) => {
    console.log(jobId);
    const response = await fetch(
      "http://localhost:8000/api/jobs/addApplication",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobId),
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Failed to apply for job");

    // Return the applied job (mocking the response)
    const appliedJob = getState().jobs.opportunities.find(
      (job) => job.id === jobId
    );

    return appliedJob;
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    opportunities: [],
    applications: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch opportunities
      .addCase(fetchOpportunities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOpportunities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.opportunities = action.payload;
      })
      .addCase(fetchOpportunities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Handle fetch applications
      .addCase(fetchApplications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Handle job application
      .addCase(applyForJob.fulfilled, (state, action) => {
        const appliedJob = action.payload;
        state.opportunities = state.opportunities.filter(
          (job) => job.id !== appliedJob.id
        );
        state.applications.push(appliedJob);
      });
  },
});
export default jobsSlice.reducer;

export const getOpportunites = (state) => state.jobs.opportunities;
export const getApplications = (state) => state.jobs.applications;
