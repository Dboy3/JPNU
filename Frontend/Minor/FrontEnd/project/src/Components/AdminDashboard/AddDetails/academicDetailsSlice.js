import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for API call
export const addAcademicDetails = createAsyncThunk(
    'academicDetails/addAcademicDetails',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/addAcademicDetails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                return rejectWithValue(error.error || 'An error occurred');
            }

            return await response.json();
        } catch (error) {
            return rejectWithValue('Network error occurred');
        }
    }
);

const academicDetailsSlice = createSlice({
    name: 'academicDetails',
    initialState: {
        loading: false,
        success: null,
        error: null,
    },
    reducers: {
        resetState: (state) => {
            state.loading = false;
            state.success = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addAcademicDetails.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(addAcademicDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.message;
                state.error = null;
            })
            .addCase(addAcademicDetails.rejected, (state, action) => {
                state.loading = false;
                state.success = null;
                state.error = action.payload;
            });
    },
});

export const { resetState } = academicDetailsSlice.actions;
export default academicDetailsSlice.reducer;
