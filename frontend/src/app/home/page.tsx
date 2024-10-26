"use client"
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import axios from 'axios';
import { useEffect } from 'react';
import { getUserData } from '@/lib/reducers/user_data_slice';
import { getGameData } from '@/lib/reducers/game_data_slice';

export default function HomePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const wallet = useAppSelector(state => state.wallet);
    const user = useAppSelector(state => state.user);
    const games = useAppSelector(state => state.games);

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

    return (
        <div>
            Game Home Page
        </div>
    )
}