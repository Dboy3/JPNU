import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks for CRUD operations
export const fetchJobPosts = createAsyncThunk("jobPosts/fetchAll", async () => {
  const response = await fetch("/api/jobPosts", {
    method: "GET",
    credentials: "include", // Automatically includes cookies
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
});

export const addJobPost = createAsyncThunk("jobPosts/add", async (newJobPost) => {
  const response = await fetch("/api/jobPosts", {
    method: "POST",
    credentials: "include", // Automatically includes cookies
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newJobPost),
  });
  return response.json();
});

export const updateJobPost = createAsyncThunk("jobPosts/update", async (updatedJobPost) => {
  const response = await fetch(`/api/jobPosts/${updatedJobPost.id}`, {
    method: "PUT",
    credentials: "include", // Automatically includes cookies
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedJobPost),
  });
  return response.json();
});

export const deleteJobPost = createAsyncThunk("jobPosts/delete", async (id) => {
  await fetch(`/api/jobPosts/${id}`, {
    method: "DELETE",
    credentials: "include", // Automatically includes cookies
    headers: {
      "Content-Type": "application/json",
    },
  });
  return id; // Return the ID to remove it from the state
});

// Job Post Slice
const jobPostSlice = createSlice({
  name: "jobPosts",
  initialState: {
    jobPosts: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJobPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobPosts = action.payload;
      })
      .addCase(fetchJobPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addJobPost.fulfilled, (state, action) => {
        state.jobPosts.push(action.payload);
      })
      .addCase(updateJobPost.fulfilled, (state, action) => {
        const index = state.jobPosts.findIndex(
          (job) => job.id === action.payload.id
        );
        if (index !== -1) {
          state.jobPosts[index] = action.payload;
        }
      })
      .addCase(deleteJobPost.fulfilled, (state, action) => {
        state.jobPosts = state.jobPosts.filter((job) => job.id !== action.payload);
      });
  },
});

export default jobPostSlice.reducer;
