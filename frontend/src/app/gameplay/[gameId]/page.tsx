"use client"
import { use, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { getUserData } from '@/lib/reducers/user_data_slice';
import { getGameData } from '@/lib/reducers/game_data_slice';
import axios from 'axios';

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
        try {
            let resultData = {
                reward: 100,
                game: game?._id,
                player: user?.user?._id,
                result: "",
                timePassed: 0,
                gambleAmount: 0
            };
            if (game?.gameType === "GAMBLING") {
                resultData.result = "WIN";
                resultData.gambleAmount = 10;
            } else if (game?.gameType === "EARNING") {
                resultData.result = "TIME BASED";
                resultData.timePassed = 100000;
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/store/rewards`, resultData);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div>
            Hello, Game ID: {gameId} <button onClick={gameResultUpdated}>result</button>
        </div>
    )
}