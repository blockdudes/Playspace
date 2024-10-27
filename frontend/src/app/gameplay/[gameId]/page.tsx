"use client"
import { use, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { getUserData } from '@/lib/reducers/user_data_slice';
import { getGameData } from '@/lib/reducers/game_data_slice';
import axios from 'axios';

import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { accounts, adminClient } from '@/admin/signer';


export default function Gameplay({ params }: { params: Promise<{ gameId: string }> }) {
    const { gameId } = use(params);
    const dispatch = useAppDispatch();
    const wallet = useAppSelector(state => state.wallet);
    const user = useAppSelector(state => state.user);
    const games = useAppSelector(state => state.games);
    const game = (games?.games as any[])?.find(item => item?.gameId === gameId);


    console.log(game)
    console.log(games);
    console.log(user);

    useEffect(() => {
        if (wallet.signer) {
            dispatch(getUserData(wallet.signer))
        }
    }, [wallet])

    useEffect(() => {
        dispatch(getGameData());
    }, [])


    const gameResultUpdated = async () => {
        let resultData = {
            reward: 100,
            game: game?._id,
            player: user?.user?._id,
            result: "",
            timePassed: 0,
            gambleAmount: 0
        };
        try {
            if (!wallet.error && wallet.signer) {
                if (resultData.reward > 0) {
                    const executeContractMessage = {
                        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                        value: MsgExecuteContract.fromPartial({
                            sender: accounts.address,
                            contract: process.env.NEXT_PUBLIC_GAME_TOKEN_CONTRACT_ADDRESS,
                            msg: toUtf8(JSON.stringify({
                                increase_allowance: {
                                    spender: wallet.signer,
                                    amount: String(resultData.reward * 10 ** 6),
                                    expires: null
                                }
                            })),
                            funds: []
                        })
                    };

                    const fee = {
                        amount: [{ amount: "280000000000000000", denom: "aconst" }],
                        gas: "2000000"
                    };

                    const result = await adminClient.signAndBroadcast(
                        accounts.address,
                        [executeContractMessage],
                        fee,
                        ""
                    );
                    console.log(result);

                    if (result.code === 0) {
                        if (game?.gameType === "GAMBLING") {
                            resultData.result = "WIN";
                            resultData.gambleAmount = 10;
                        } else if (game?.gameType === "EARNING") {
                            resultData.result = "TIME BASED";
                            resultData.timePassed = 100000;
                        }
                        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/store/rewards`, resultData);
                    }
                }
            } else {
                console.log("connect your wallet!");
            }
        } catch (error) {
            if (error instanceof Error && error.message.includes("Invalid string. Length must be a multiple of 4")) {
                console.warn("Non-critical error during transaction decoding:", error.message);
                // You might want to add some additional logging or telemetry

                if (game?.gameType === "GAMBLING") {
                    resultData.result = "WIN";
                    resultData.gambleAmount = 10;
                } else if (game?.gameType === "EARNING") {
                    resultData.result = "TIME BASED";
                    resultData.timePassed = 100000;
                }
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/store/rewards`, resultData);

            } else {
                throw error
            }
        }
    }


    return (
        <div>
            Hello, Game ID: {gameId} <button onClick={gameResultUpdated}>result</button>
        </div>
    )
}