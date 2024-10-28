import { Router, Request, Response, NextFunction } from "express";
import { claimUserRewards, getAllUser, getGameHistoryByUser, getUserByAddress, register, storeUserRewards } from "../controllers/user.controller";

export default Router()
    .post("/user/register", async (req: Request, res: Response, next: NextFunction) => {
        try {
            register(req, res, next);
        } catch (error) {
            next(error);
        }
    })
    .get("/user/get/all", async (req: Request, res: Response, next: NextFunction) => {
        try {
            getAllUser(req, res, next);
        } catch (error) {
            next(error);
        }
    })
    .get("/user/get/:address", async (req: Request, res: Response, next: NextFunction) => {
        try {
            getUserByAddress(req, res, next);
        } catch (error) {
            next(error);
        }
    })
    .post("/user/store/rewards", async (req: Request, res: Response, next: NextFunction) => {
        try {
            storeUserRewards(req, res, next);
        } catch (error) {
            next(error);
        }
    })
    .post("/user/claim/rewards/:address", async (req: Request, res: Response, next: NextFunction) => {
        try {
            claimUserRewards(req, res, next);
        } catch (error) {
            next(error);
        }
    })
    .get("/user/games/history/:address", async (req: Request, res: Response, next: NextFunction) => {
        try {
            getGameHistoryByUser(req, res, next);
        } catch (error) {
            next(error);
        }
    })