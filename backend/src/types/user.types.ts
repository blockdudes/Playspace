import { Document, Types } from "mongoose";

export interface User extends Document {
    name: string;
    email: string;
    image: string;
    rewards: number;
    address: string;
    username: string;
    password: string;
}