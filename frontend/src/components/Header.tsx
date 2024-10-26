"use client"
import { connectWallet } from "@/lib/reducers/integrate_wallet_slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'

const Header = () => {
    const dispatch = useAppDispatch();
    const wallet = useAppSelector(state => state.wallet);
    console.log(wallet);


    const router = useRouter();
    // useEffect(() => {
    //     if (!wallet.error && wallet.signer) {
    //         router.push("/home")
    //     }
    // }, [wallet])

    return (
        <div>
            Header
            <button onClick={() => dispatch(connectWallet())}>connect</button>
        </div>
    )
}

export default Header;