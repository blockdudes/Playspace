import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/user.model";
import { gameHistoryModel } from "../models/game.model";
const error = new Error();

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, username, email, image, address, password } = req.body;

        if (!name || !username || !email || !image || !address || !password) {
            error.message = "missing required fields";
            (error as any).statusCode = 400;
            return next(error);
        }

        const checkUserExist = await userModel.findOne({ address });
        if (checkUserExist) {
            error.message = "User already exist";
            (error as any).statusCode = 400;
            return next(error);
        }

        const createUser = await userModel.create({ name, username, email, image, address, password });
        return res.status(201).json({ message: "User created successfully", user: createUser });
    } catch (error) {
        next(error);
    }
}

export const getUserByAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const address = req.params.address;
        const userFind = await userModel.findOne({ address });
        if (!userFind) {
            return res.status(200).json({ user: null, isAuth: false });
        }
        return res.status(200).json({ user: userFind, isAuth: true });
    } catch (error) {
        next(error);
    }
}

export const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userModel.find();
        return res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
}

export const storeUserRewards = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let gameHistory: any;
        let updatedUser: any;
        const { reward, game, player, result, timePassed, gambleAmount } = req.body;

        if (typeof reward !== 'number' || typeof timePassed !== 'number' || typeof gambleAmount !== 'number' || !game || !player || !result) {
            error.message = "Invalid input: address and reward (number) are required";
            (error as any).statusCode = 400;
            return next(error);
        }

        if (result !== "LOSS") {
            const updated = await userModel.findByIdAndUpdate(
                { _id: player },
                { $inc: { rewards: reward } },
                { new: true, runValidators: true }
            );

            if (!updated) {
                error.message = "User not found";
                (error as any).statusCode = 404;
                return next(error);
            }
            updatedUser = updated;
        }

        if (["WIN", "LOSS"].includes(result)) {
            console.log("Enter: 1")
            gameHistory = await gameHistoryModel.create({
                game, player, result, reward, gambleAmount
            })
        } else if (result === "TIME BASED") {
            console.log("Enter: 2")
            const findGameHistory = await gameHistoryModel.findOne({ game });
            if (findGameHistory) {
                gameHistory = await gameHistoryModel.findByIdAndUpdate(findGameHistory._id, {
                    $inc: { timePassed, reward }
                }, { new: true });
            } else {
                gameHistory = await gameHistoryModel.create({
                    game, player, result, reward, timePassed
                });
            }
        }

        return res.status(200).json({ message: "Rewards updated successfully", user: updatedUser, gameHistory });
    } catch (error) {
        next(error);
    }
}

export const claimUserRewards = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const address = req.params.address;
        if (!address) {
            error.message = "Invalid address param: address are required";
            (error as any).statusCode = 400;
            return next(error);
        }

        const updatedUser = await userModel.findOneAndUpdate(
            { address },
            { $set: { rewards: 0 } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            error.message = "User not found";
            (error as any).statusCode = 404;
            return next(error);
        }

        const claimedRewards = updatedUser.rewards;
        return res.status(200).json({
            message: "Rewards claimed successfully",
            claimedRewards,
            user: updatedUser
        });

    } catch (error) {
        next(error)
    }
}

export const getGameHistoryByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const address = req.params.address;
        const userFind = await userModel.findOne({ address });
        if (!userFind) {
            error.message = "user not exist!";
            (error as any).statusCode = 400;
            return next(error);
        }
        const userGameHistory = await gameHistoryModel.find({ player: userFind._id });

        return res.status(200).json({
            message: "user game history",
            userGameHistory
        })
    } catch (error) {
        next(error)
    }
}