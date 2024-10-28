import mongoose, { Schema } from "mongoose";
import { User } from "../types/user.types";

const UserSchema: Schema<User> = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    rewards: { type: Number, default: 0 },
    password: { type: String, required: true },
})

export const userModel = mongoose.model<User>("aurora_user", UserSchema);