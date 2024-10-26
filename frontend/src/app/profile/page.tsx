"use client"

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getUserData } from "@/lib/reducers/user_data_slice";
import axios from "axios";
import { useEffect, useState } from "react";

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
            // contract call mint token to the user

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/claim/rewards/${wallet.signer}`);
            console.log(response)

            if (response.data) {
                dispatch(getUserData(wallet.signer));
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            Hello User Profile <button onClick={claimRewards}>claim</button>
        </div>
    )
}