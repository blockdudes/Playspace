import { Request, Response, NextFunction } from "express";
import { gameModel } from "../models/game.model";
import { userModel } from "../models/user.model";

const error = new Error();

export const registerGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gameName, gameType, gameCreator, gameData, gameImages, gameCategory, gameDescription } = req.body;
        if (!gameName || !gameType || !gameCreator || !gameData || !gameImages || (gameImages as string[]).length === 0 || !gameCategory || !gameDescription) {
            error.message = "missing required fields";
            (error as any).statusCode = 400;
            return next(error);
        }

        const games = await gameModel.find().populate({
            path: 'gameCreator',
            select: 'name image email address username'
        });


        const checkUserRegistered = await userModel.findById({ _id: gameCreator });
        if (!checkUserRegistered) {
            error.message = "user not exist!";
            (error as any).statusCode = 400;
            return next(error);
        }

        const checkGameExist = await gameModel.findOne({ gameData });
        if (checkGameExist) {
            error.message = "Game already exist";
            (error as any).statusCode = 400;
            return next(error);
        }

        const createGame = await gameModel.create({ gameId: games.length, gameName, gameType, gameCreator, gameData, gameImages, gameCategory, gameDescription });
        return res.status(200).json({ message: "created successfully...", game: createGame })
    } catch (error) {
        next(error);
    }
}

export const getAllGames = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const games = await gameModel.find().populate({
            path: 'gameCreator',
            select: 'name image email address username'
        });
        return res.status(200).json({ games });
    } catch (error) {
        next(error);
    }
}

export const getGameByGameId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gameId = req.params.gameId;
        const gameFind = await gameModel.findOne({ gameId }).populate({
            path: 'gameCreator',
            select: 'name image email address username'
        });
        if (!gameFind) {
            error.message = "game not exist!";
            (error as any).statusCode = 400;
            return next(error);
        }
        return res.status(200).json({ gameFind });
    } catch (error) {
        next(error);
    }
}
