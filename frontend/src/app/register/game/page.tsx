"use client"

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback, useEffect } from "react";
import { getUserData } from "@/lib/reducers/user_data_slice";

export default function Page() {

    const dispatch = useAppDispatch();
    const wallet = useAppSelector(state => state.wallet);
    const user = useAppSelector(state => state.user);

    useEffect(() => {
        if (wallet.signer) {
            dispatch(getUserData(wallet.signer))
        }
    }, [wallet])

    const registerGame = useCallback(async () => {
        try {
            if (!wallet.error && wallet.signer) {
                const gameData = {
                    gameId: uuidv4(),
                    gameName: "cryptic",
                    gameType: "GAMBLING",
                    gameCreator: user.user?._id,
                    gameData: "game_data_1",
                    gameImages: ["0xd9eb5cfed425152a47a35dcfc43d0acbfb865feba0fc54f20fc6f40903c467d6", "0xd9eb5cfed425152a47a35dcfc43d0acbfb865feba0fc54f20fc6f40903c467d6", "0xd9eb5cfed425152a47a35dcfc43d0acbfb865feba0fc54f20fc6f40903c467d6", "0xd9eb5cfed425152a47a35dcfc43d0acbfb865feba0fc54f20fc6f40903c467d6"]
                }
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/game/register`, gameData);
                console.log(response.data);
            } else {
                console.log("connect your wallet!");
            }
        } catch (error) {
            console.log(error);
        }
    }, [wallet])

    return (
        <div>
            <button onClick={registerGame}>register game</button>
        </div>
    )
}