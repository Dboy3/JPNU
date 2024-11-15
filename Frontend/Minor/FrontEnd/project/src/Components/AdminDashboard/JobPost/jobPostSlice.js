import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunk to fetch job posts
export const fetchJobPosts = createAsyncThunk('jobs/fetchJobPosts', async () => {
  const response = await fetch('http://localhost:8000/api/jobs/get');
  if (!response.ok) {
    throw new Error('Failed to fetch job posts');
  }
  return response.json();
});

// Async Thunk to add a new job post
export const addJobPost = createAsyncThunk('jobs/addJobPost', async (newJob) => {
  const response = await fetch('http://localhost:8000/api/jobs/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
    body: JSON.stringify(newJob),
  });
  if (!response.ok) {
    throw new Error('Failed to add job post');
  }
  return response.json();
});

// Async Thunk to update a job post
export const updateJobPost = createAsyncThunk('jobs/updateJobPost', async (updatedJob) => {
  const response = await fetch(`http://localhost:8000/api/jobs/${updatedJob.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
    body: JSON.stringify(updatedJob),
  });
  if (!response.ok) {
    throw new Error('Failed to update job post');
  }
  return response.json();
});

// Async Thunk to delete a job post
export const deleteJobPost = createAsyncThunk('jobs/deleteJobPost', async (job) => {
  const response = await fetch(`http://localhost:8000/api/jobs/${job.id}`, {
    method: 'DELETE',
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error('Failed to delete job post');
  }
  return id;
});

// Job Post slice
const jobPostSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload;
      })
      .addCase(fetchJobPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addJobPost.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(updateJobPost.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(deleteJobPost.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter(job => job.id !== action.payload);
      });
  },
});

export default jobPostSlice.reducer;
