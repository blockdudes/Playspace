import { Document, Types } from "mongoose";

export interface Game extends Document {
    gameId: string;
    gameName: string;
    gameType: "GAMBLING" | "EARNING" | "PRACTICE";
    gameCreator: Types.ObjectId;
    gameData: string;
    gameImages: string[];
}

export interface GameHistory extends Document {
    game: Types.ObjectId;
    player: Types.ObjectId;
    result: "WIN" | "LOSS" | "TIME BASED";
    reward: number;
    timePassed: number;
    gambleAmount: number;
}