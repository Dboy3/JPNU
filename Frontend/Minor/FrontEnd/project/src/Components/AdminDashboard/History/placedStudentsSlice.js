import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// AsyncThunk for fetching placed students
export const fetchPlacedStudents = createAsyncThunk(
    'placedStudents/fetchPlacedStudents',
    async () => {
        const response = await fetch('http://localhost:8000/api/jobs/placed-students');
        if (!response.ok) {
            throw new Error('Failed to fetch placed students');
        }
        return response.json();
    }
);

export const fetchPlacedStudentsData = createAsyncThunk(
    'placedStudents/fetchPlacedStudentsData',
    async () => {
        const response = await fetch('http://localhost:8000/api/jobs/getallplaced');
        if (!response.ok) {
            throw new Error('Failed to fetch placed students');
        }
        return response.json();
    }
);


const placedStudentsSlice = createSlice({
    name: 'placedStudents',
    initialState: {
        students1: [],
        students2 :[] ,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlacedStudents.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPlacedStudents.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.students1 = action.payload;
            })
            .addCase(fetchPlacedStudents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchPlacedStudentsData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPlacedStudentsData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.students2 = action.payload;
            })
            .addCase(fetchPlacedStudentsData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default placedStudentsSlice.reducer;
export const getPlacedStudents = (state) => state.placedStudents.students1 ;
export const getPlacedStudentsData = (state) => state.placedStudents.students2 ;
