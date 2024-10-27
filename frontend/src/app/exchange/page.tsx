"use client"

import { useAppSelector } from "@/lib/hooks";
import { accounts, adminClient } from "@/admin/signer";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";


export default function Page() {

    const wallet = useAppSelector(state => state.wallet);
    console.log(wallet)

    const exchange = async () => {
        const tokens = {
            tokenA: {
                type: "fungible",
                amount: 1
            },
            tokenB: {
                type: process.env.NEXT_PUBLIC_GAME_TOKEN_CONTRACT_ADDRESS,
                amount: 1
            }
        }

        const fee = {
            amount: [{ amount: "280000000000000000", denom: "aconst" }],
            gas: "2000000"
        };
        try {


            if (tokens.tokenA.type === "native") {
                const sendMsg = {
                    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
                    value: {
                        fromAddress: wallet.signer,
                        toAddress: accounts.address,
                        amount: [
                            {
                                denom: 'aconst',
                                amount: String(Number(tokens.tokenA.amount) * 10 ** 18),
                            },
                        ],
                    },
                };

                const result = await wallet.clientSigner.signAndBroadcast(wallet.signer, [sendMsg], 'auto');
                if (result.code === 0) {
                    const executeContractMessage = {
                        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                        value: MsgExecuteContract.fromPartial({
                            sender: accounts.address,
                            contract: process.env.NEXT_PUBLIC_GAME_TOKEN_CONTRACT_ADDRESS,
                            msg: toUtf8(JSON.stringify({
                                transfer: {
                                    recipient: wallet.signer,
                                    amount: String(Number(tokens.tokenB.amount) * 10 ** 6)
                                }
                            })),
                            funds: []
                        })
                    };

                    console.log(executeContractMessage);



                    const result = await adminClient.signAndBroadcast(
                        accounts.address,
                        [executeContractMessage],
                        fee,
                        ""
                    );

                } else {
                    console.log("error");
                }
            } else {
                const executeContractMessage = {
                    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                    value: MsgExecuteContract.fromPartial({
                        sender: wallet.signer,
                        contract: process.env.NEXT_PUBLIC_GAME_TOKEN_CONTRACT_ADDRESS,
                        msg: toUtf8(JSON.stringify({
                            transfer: {
                                recipient: accounts.address,
                                amount: String(Number(tokens.tokenA.amount) * 10 ** 6)
                            }
                        })),
                        funds: []
                    })
                };

                console.log(executeContractMessage);

                const fee = {
                    amount: [{ amount: "280000000000000000", denom: "aconst" }],
                    gas: "2000000"
                };

                const result = await wallet.clientSigner.signAndBroadcast(
                    wallet.signer,
                    [executeContractMessage],
                    fee,
                    ""
                );

                if (result.code === 0) {
                    const sendMsg = {
                        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
                        value: {
                            fromAddress: accounts.address,
                            toAddress: wallet.signer,
                            amount: [
                                {
                                    denom: 'aconst',
                                    amount: String(Number(tokens.tokenB.amount) * 10 ** 18),
                                },
                            ],
                        },
                    };

                    const resultNative = await adminClient.signAndBroadcast(accounts.address, [sendMsg], fee, "");

                    console.log(resultNative);

                    if (resultNative.code === 0) {
                        console.log("success")
                    } else {
                        console.log("failed")
                    }
                }
            }

            console.log(tokens)
        } catch (error) {
            if (error instanceof Error && error.message.includes("Invalid string. Length must be a multiple of 4")) {
                console.warn("Non-critical error during transaction decoding:", error.message);
                // You might want to add some additional logging or telemetry 

                try {
                    if (tokens.tokenA.type !== "native") {
                        const sendMsg = {
                            typeUrl: '/cosmos.bank.v1beta1.MsgSend',
                            value: {
                                fromAddress: accounts.address,
                                toAddress: wallet.signer,
                                amount: [
                                    {
                                        denom: 'aconst',
                                        amount: String(Number(tokens.tokenB.amount) * 10 ** 18),
                                    },
                                ],
                            },
                        };

                        const resultNative = await adminClient.signAndBroadcast(accounts.address, [sendMsg], fee, "");

                        console.log(resultNative);

                        if (resultNative.code === 0) {
                            console.log("success")
                        } else {
                            console.log("failed")
                        }
                    }
                } catch (error) {
                    if (error instanceof Error && error.message.includes("Invalid string. Length must be a multiple of 4")) {
                        console.warn("Non-critical error during transaction decoding:", error.message);
                    }
                }
            } else {
                // Re-throw any other errors
                throw error;
            }
        }
    }

    return (
        <div>
            <button onClick={exchange}>exchange</button>
        </div>
    )
}