"use client"
import { connectWallet } from "@/lib/reducers/integrate_wallet_slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import axios from "axios";

const LendingPage = () => {
    const dispatch = useAppDispatch();
    const wallet = useAppSelector(state => state.wallet);
    const router = useRouter();

    useEffect(() => {
        const checkUserStatus = async (signer: any) => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/get/${signer}`);
            if (response?.data?.isAuth) {
                router.push(`${process.env.NEXT_PUBLIC_HOME_URL}`);
            } else {
                router.push(`${process.env.NEXT_PUBLIC_REGISTER_USER_URL}`);
            }
        }
        if (!wallet.error && wallet.signer) {
            checkUserStatus(wallet.signer);
        }
    }, [wallet])

    return (
        <div>
            Home Page
            <button onClick={() => dispatch(connectWallet())}>connect</button>
        </div>
    )
}

export default LendingPage;