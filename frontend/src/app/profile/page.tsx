"use client"

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getUserData } from "@/lib/reducers/user_data_slice";
import axios from "axios";
import { useEffect, useState } from "react";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { accounts, adminClient } from "@/admin/signer";

export default function Page() {

    const dispatch = useAppDispatch();
    const wallet = useAppSelector(state => state.wallet);
    const user = useAppSelector(state => state.user);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const getHistory = async (signer: any) => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/games/history/${signer}`);
                setHistory(response?.data?.userGameHistory)
            } catch (error) {
                console.log(error);
            }
        }
        if (wallet.signer) {
            dispatch(getUserData(wallet.signer));
            getHistory(wallet.signer);
        }
    }, [wallet])

    const claimRewards = async () => {
        try {
            if (!wallet.error && wallet.signer) {
                const query = await wallet.clientSigner.queryContractSmart(
                    process.env.NEXT_PUBLIC_GAME_TOKEN_CONTRACT_ADDRESS,
                    {
                        allowance: {
                            owner: accounts.address,
                            spender: wallet.signer
                        }
                    }
                )

                if (Number(query.allowance) > 0) {
                    const executeContractMessage = {
                        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                        value: MsgExecuteContract.fromPartial({
                            sender: accounts.address,
                            contract: process.env.NEXT_PUBLIC_GAME_TOKEN_CONTRACT_ADDRESS,
                            msg: toUtf8(JSON.stringify({
                                transfer_from: {
                                    owner: wallet.signer,
                                    recipient: accounts.address,
                                    amount: query.allowance
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
                    if (result.code === 0) {
                        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/claim/rewards/${wallet.signer}`);
                        if (response.data) {
                            dispatch(getUserData(wallet.signer));
                        }
                    }
                }
            } else {
                console.log("connect your wallet!");
            }
        } catch (error) {
            if (error instanceof Error && error.message.includes("Invalid string. Length must be a multiple of 4")) {
                console.warn("Non-critical error during transaction decoding:", error.message);
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/claim/rewards/${wallet.signer}`);
                if (response.data) {
                    dispatch(getUserData(wallet.signer));
                }
            } else {
                throw error;
            }
        }
    }

    return (
        <div>
            Hello User Profile <button onClick={claimRewards}>claim</button>
        </div>
    )
}