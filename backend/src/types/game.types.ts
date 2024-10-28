import { Document, Types } from "mongoose";

export interface Game extends Document {
    gameId: string;
    gameName: string;
    gameImages: string[];
    gamePlayerCount: number;
    gameTokenSymbol: string;
    gameCategory: string;
    gameType: "GAMBLING" | "EARNING" | "PRACTICE";
    gameDescription: string;
    gameRating: string;
    gameCreator: Types.ObjectId;
    gameData: string;
}

export interface GameHistory extends Document {
    game: Types.ObjectId;
    player: Types.ObjectId;
    result: "WIN" | "LOSS" | "TIME BASED";
    reward: number;
    timePassed: number;
    gambleAmount: number;
}