import { Router, Request, Response, NextFunction } from "express";
import { registerGame, getAllGames, getGameByGameId } from "../controllers/game.controller";

export default Router()
    .post("/game/register", async (req: Request, res: Response, next: NextFunction) => {
        try {
            registerGame(req, res, next);
        } catch (error) {
            next(error);
        }
    })
    .get("/game/get/all", async (req: Request, res: Response, next: NextFunction) => {
        try {
            getAllGames(req, res, next);
        } catch (error) {
            next(error);
        }
    })
    .get("/game/get/:gameId", async (req: Request, res: Response, next: NextFunction) => {
        try {
            getGameByGameId(req, res, next);
        } catch (error) {
            next(error);
        }
    });