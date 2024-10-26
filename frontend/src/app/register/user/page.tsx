"use client"
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import axios from "axios";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export default function Page() {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const wallet = useAppSelector(state => state.wallet);
    console.log(wallet);

    const registerUser = useCallback(async () => {
        try {
            const userData = {
                "name": "somyaranjan",
                "username": "somyaranjankhatua.0",
                "email": "somyaranjankhatua@gmail.com",
                "image": "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
                "address": wallet.signer!,
                "password": "1234567890"
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/register`, userData);
            if (response?.data?.message) {
                router.push(`${process.env.NEXT_PUBLIC_HOME_URL}`)
            }

            console.log(userData);

        } catch (error) {
            console.log(error);
        }
    }, [wallet])


    return (
        <div>
            USER REGISTER - <button onClick={registerUser}>register</button>
        </div>
    )
}