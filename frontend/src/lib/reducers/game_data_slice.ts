"use client"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface gameDataType {
    games: null | any;
    error: null | any;
    loading: boolean;
}

const initialGameDataState: gameDataType = {
    games: null,
    error: null,
    loading: false
}

export const getGameData = createAsyncThunk("get/game/data", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/game/get/all`);
        return { games: response?.data?.games }
    } catch (error) {
        rejectWithValue(error);
    }
})

export const gameSlice = createSlice({
    name: "game data slice",
    initialState: initialGameDataState,
    extraReducers: builder => {
        builder
            .addCase(getGameData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGameData.fulfilled, (state, action) => {
                state.loading = false;
                state.games = action.payload?.games;
                state.error = null;
            })
            .addCase(getGameData.rejected, (state, action) => {
                state.loading = false;
                state.games = null;
                state.error = action.error;
            })
    },
    reducers: {}
})

export default gameSlice.reducer;