import mongoose, { Schema } from "mongoose";
import { Game, GameHistory } from "../types/game.types";

const GameSchema: Schema<Game> = new Schema({
    gameId: { type: String, required: true, unique: true },
    gameName: { type: String, required: true, unique: true },
    gameType: {
        type: String,
        required: true,
        enum: ["GAMBLING", "EARNING", "PRACTICE"]
    },
    gameCreator: { type: Schema.Types.ObjectId, required: true, ref: 'aurora_user' },
    gameData: { type: String, required: true, unique: true },
    gameImages: { type: [String], required: true }
}, {
    timestamps: true
});

const GameHistorySchema: Schema<GameHistory> = new Schema({
    game: { type: Schema.Types.ObjectId, required: true, ref: 'aurora_game' },
    player: { type: Schema.Types.ObjectId, required: true, ref: 'aurora_user' },
    result: { type: String, required: true, enum: ["WIN", "LOSS", "TIME BASED"] },
    reward: { type: Number, required: true },
    timePassed: { type: Number, default: 0 },
    gambleAmount: { type: Number, default: 0 }
}, {
    timestamps: true
})

export const gameModel = mongoose.model<Game>("aurora_game", GameSchema);
export const gameHistoryModel = mongoose.model<GameHistory>("aurora_game_history", GameHistorySchema);