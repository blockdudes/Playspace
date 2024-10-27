"use client"

import { useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { accounts, adminClient } from "@/admin/signer";

export default function Page() {

    const wallet = useAppSelector(state => state.wallet);
    console.log(wallet)

    const convertConstToEUCL = async (constAmount: number) => {
        const conversionRate = 0.488835;
        const euclAmount = constAmount * conversionRate;
        return euclAmount;
    }

    const convertConstToEUCLGameToken = (constAmount: number): number => {
        const conversionRate = 20;
        return constAmount * conversionRate;
    };

    const convertEUCLGameTokenToConst = (euclGameTokenAmount: number): number => {
        const conversionRate = 20;
        return euclGameTokenAmount / conversionRate;
    };

    const exchange = async (tokens: any) => {

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
                                    amount: String(convertConstToEUCLGameToken(tokens.tokenA.amount) * 10 ** 6)
                                }
                            })),
                            funds: []
                        })
                    };

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
                console.log(convertEUCLGameTokenToConst(tokens.tokenA.amount));

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
                                    amount: String(convertEUCLGameTokenToConst(tokens.tokenA.amount) * 10 ** 18),
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
                        console.log(convertEUCLGameTokenToConst(tokens.tokenA.amount));
                        const sendMsg = {
                            typeUrl: '/cosmos.bank.v1beta1.MsgSend',
                            value: {
                                fromAddress: accounts.address,
                                toAddress: wallet.signer,
                                amount: [
                                    {
                                        denom: 'aconst',
                                        amount: String(convertEUCLGameTokenToConst(tokens.tokenB.amount) * 10 ** 18),
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

    const swap = async () => {
        try {
            const tokens = {
                tokenA: {
                    type: "fungible",
                    amount: 20
                },
                tokenB: {
                    type: process.env.NEXT_PUBLIC_GAME_TOKEN_CONTRACT_ADDRESS,
                    amount: 1
                },
                transactionType: "EXE"
            }

            if (!wallet.error && wallet.signer) {
                if (tokens.transactionType === "SWAP") {
                    const swapResponse = await axios.post('https://testnet.api.euclidprotocol.com/api/v1/execute/swap', {
                        amount_in: String(Number(tokens.tokenA.amount) * 10 ** 18),
                        asset_in: {
                            token: "const",
                            token_type: { voucher: {} }
                        },
                        asset_out: "euclid",
                        cross_chain_addresses: [],
                        min_amount_out: "1",
                        partner_fee: null,
                        sender: {
                            address: wallet.signer,
                            chain_uid: "archway"
                        },
                        swaps: ["const", "euclid"],
                        timeout: null
                    }, {
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });

                    const { sender, contract, msgs } = swapResponse.data;

                    // console.log(sender, contract, msgs);

                    const executeContractMessage = {
                        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                        value: MsgExecuteContract.fromPartial({
                            sender: wallet.signer,
                            contract: contract,
                            msg: toUtf8(JSON.stringify(msgs[0].msg)),
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
                        "Executing swap"
                    );

                    console.log("Transaction result:", (convertConstToEUCLGameToken(tokens.tokenA.amount)));

                    if (result.code === 0) {
                        const executeContractMessage = {
                            typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                            value: MsgExecuteContract.fromPartial({
                                sender: accounts.address,
                                contract: process.env.NEXT_PUBLIC_GAME_TOKEN_CONTRACT_ADDRESS,
                                msg: toUtf8(JSON.stringify({
                                    transfer: {
                                        recipient: wallet.signer,
                                        amount: String(convertConstToEUCLGameToken(tokens.tokenA.amount) * 10 ** 6)
                                    }
                                })),
                                funds: []
                            })
                        };

                        const result = await adminClient.signAndBroadcast(
                            accounts.address,
                            [executeContractMessage],
                            fee,
                            ""
                        );
                    }

                } else {
                    await exchange(tokens);
                }
            } else {
                console.log("connect your wallet!");
            }
        } catch (error) {
            if (error instanceof Error && error.message.includes("Invalid string. Length must be a multiple of 4")) {
                console.warn("Non-critical error during transaction decoding:", error.message);
            } else {
                throw error;
            }
        }
    }

    const approveTokens = async (amount: number,) => {
        try {
            if (!wallet.error && wallet.signer) {
                const executeContractMessage = {
                    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                    value: MsgExecuteContract.fromPartial({
                        sender: wallet.signer,
                        contract: process.env.NEXT_PUBLIC_GAME_TOKEN_CONTRACT_ADDRESS,
                        msg: toUtf8(JSON.stringify({
                            increase_allowance: {
                                spender: accounts.address,
                                amount: String(amount * 10 ** 6),
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

                const result = await wallet.clientSigner.signAndBroadcast(
                    wallet.signer,
                    [executeContractMessage],
                    fee,
                    ""
                );
                console.log(result);
            } else {
                console.log("connect your wallet!")
            }

        } catch (error) {
            if (error instanceof Error && error.message.includes("Invalid string. Length must be a multiple of 4")) {
                console.warn("Non-critical error during transaction decoding:", error.message);
                // You might want to add some additional logging or telemetry 
            }
        }
    }


    const transferFromTokens = async (amount: number) => {
        console.log(amount);
        try {
            if (!wallet.error && wallet.signer) {
                const executeContractMessage = {
                    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                    value: MsgExecuteContract.fromPartial({
                        sender: accounts.address,
                        contract: process.env.NEXT_PUBLIC_GAME_TOKEN_CONTRACT_ADDRESS,
                        msg: toUtf8(JSON.stringify({
                            transfer_from: {
                                owner: wallet.signer,
                                recipient: accounts.address,
                                amount: String(amount * 10 ** 6)
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

                const result = await adminClient.signAndBroadcast(
                    accounts.address,
                    [executeContractMessage],
                    fee,
                    ""
                );
                console.log(result);
            } else {
                console.log("connect your wallet!")
            }

        } catch (error) {
            if (error instanceof Error && error.message.includes("Invalid string. Length must be a multiple of 4")) {
                console.warn("Non-critical error during transaction decoding:", error.message);
                // You might want to add some additional logging or telemetry 
            }
        }
    }

    return (
        <div>
            <button onClick={swap}>swap</button> <br />
            <button onClick={() => approveTokens(10)}>approve</button> <br />
            <button onClick={() => transferFromTokens(10)}>transfer from</button> <br />
        </div>
    )
}