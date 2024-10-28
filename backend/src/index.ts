import express, { NextFunction, Request, Response } from "express";
import env from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/user.router";
import gameRouter from "./routes/game.router";

env.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use("/api", [userRouter, gameRouter]);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status((err as any).statusCode || 500).json({ message: err.message });
});

const mongooseURI = process.env.MONGO_DB_URL || "";
mongoose.connect(mongooseURI).then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});