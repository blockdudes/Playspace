"use client"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface userDataType {
    user: null | any;
    error: null | any;
    loading: boolean;
}

const initialUserDataState: userDataType = {
    user: null,
    error: null,
    loading: false
}

export const getUserData = createAsyncThunk("get/user/data", async (signer: any, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/get/${signer}`);
        console.log('response',response)
        return { user: response?.data?.user }
    } catch (error) {
        rejectWithValue(error);
    }
})

export const userSlice = createSlice({
    name: "user data slice",
    initialState: initialUserDataState,
    extraReducers: builder => {
        builder
            .addCase(getUserData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user;
                state.error = null;
            })
            .addCase(getUserData.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.error;
            })
    },
    reducers: {}
})

export default userSlice.reducer;