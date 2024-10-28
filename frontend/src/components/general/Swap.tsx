'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Settings, ArrowDownUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from 'cosmwasm'
import { accounts, adminClient } from "@/admin/signer";
import axios from 'axios'
import { connectWallet } from '@/lib/reducers/integrate_wallet_slice'



const tokens = [
  { symbol: 'EGT', name: 'EuclidGameToken', video: '/assets/eucl.mp4' },
  { symbol: 'Arch', name: 'Arch', logo: 'https://assets.coingecko.com/coins/images/30789/large/bxLJkEWw_400x400.jpg?1696529656' },
]



export default function SwapComponent() {
  const [inputToken, setInputToken] = useState(tokens[0])
  const [outputToken, setOutputToken] = useState(tokens[1])
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [isSwapping, setIsSwapping] = useState(false)
  const wallet = useAppSelector(state => state.wallet);
  const [gameTokenBalance, setGameTokenBalance] = useState<string | undefined>(undefined)
  const [nativeBalance, setNativeBalance] = useState<string | undefined>(undefined)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(connectWallet())
    if (inputAmount) {
      const calculatedOutput =  inputToken.symbol === "EGT" ? (convertEUCLGameTokenToConst(Number(inputAmount))) : (convertConstToEUCLGameToken(Number(inputAmount)))
      setOutputAmount(calculatedOutput.toFixed(3))
    } else {
      setOutputAmount('')
    }
  }, [inputAmount, inputToken, outputToken])

  useEffect(() => {
    balance("EGT").then((balance) => setGameTokenBalance(balance))
    balance("Arch").then((balance) => setNativeBalance(balance))
  }, [wallet])

  const handleSwap = async () => {
    try {
      if (!wallet.signer) {
        throw new Error("Connect your wallet")
      }

      if (inputAmount === '0' || !inputAmount || inputToken.symbol === outputToken.symbol) {
        throw new Error("Enter an amount or select different tokens")
      }
      
      setIsSwapping(true)
      if (inputToken.symbol === "EGT") {
        await swap("fungible", Number(inputAmount), "EXE")
      } else {
        await swap("native", Number(inputAmount), "SWAP")
      }
    
    } catch (error) {
      throw error      
    }
    finally{
      setIsSwapping(false)
      setInputAmount('')
      setOutputAmount('')
    }
  }

  const balance = async (token: string) => {
    console.log(wallet)
    if (token === "EGT") {
      const query = await wallet.clientSigner?.queryContractSmart(
        process.env.NEXT_PUBLIC_GAME_TOKEN_CONTRACT_ADDRESS,
        {
            balance: {
                address: wallet.signer,
            }
        }
    )
    const balance = (query.balance / 10 ** 6).toFixed(3).toString();
    return balance;
    } else if (token === "Arch"){
      const query = await wallet.clientSigner?.queryClient.bank.balance(wallet.signer, "aconst")
      return (query.amount / 10 ** 18).toFixed(3).toString();
    }
  }

  const TokenSelector = ({ token, setToken, label, excludeToken }: { token: any, setToken: any, label: string, excludeToken: any }) => {
    
    return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center justify-center bg-white/10 w-full rounded-lg backdrop-blur-md hover:bg-white/30 transition border border-white/30 shadow-lg">
          {token.video ? (
            <video src={token.video} autoPlay loop muted className="w-6 h-6 rounded-full mr-2" />
          ) : (
            <img src={token.logo} alt={token.name} className="w-6 h-6 rounded-full mr-2" />
          )}
          <span className="text-lg text-white font-medium">{token.symbol}</span>
          <ChevronDown className="h-4 w-4 ml-auto text-white opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4 rounded-lg backdrop-blur-lg bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border border-gray-600 shadow-2xl">
        <Label className="block mb-2 text-white/70 text-sm font-semibold">{label}</Label>
        <div className="space-y-2">
          {tokens
            .filter((t) => t.symbol !== excludeToken.symbol)
            .map((t) => (
              <Button
                key={t.symbol}
                variant="ghost"
                className="flex items-center w-full p-2 rounded-md hover:bg-gray-700/40 transition"
                onClick={() => setToken(t)}
              >
                {t.video ? (
                  <video src={t.video} autoPlay loop muted className="w-6 h-6 rounded-full mr-2" />
                ) : (
                  <img src={t.logo} alt={t.name} className="w-6 h-6 rounded-full mr-2" />
                )}
                <span className="text-white font-medium">{t.symbol}</span>
                <span className="ml-auto text-sm text-gray-400">{t.symbol === "EGT" ? gameTokenBalance : nativeBalance}</span>
              </Button>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  )}

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

const swap = async (type: string, amount: number, transactionType: string) => {
  try {

      const tokens = {
          tokenA: {
              type: type,
              amount: amount
          },
          tokenB: {
              type: process.env.NEXT_PUBLIC_GAME_TOKEN_CONTRACT_ADDRESS,
              amount: 1
          },
          transactionType: transactionType
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
                
              //   const sendMsg = {
              //     typeUrl: '/cosmos.bank.v1beta1.MsgSend',
              //     value: {
              //         fromAddress: wallet.signer,
              //         toAddress: accounts.address,
              //         amount: [
              //             {
              //                 denom: 'aconst',
              //                 amount: String(Number(tokens.tokenA.amount) * 10 ** 18),
              //             },
              //         ],
              //     },
              // };
    
              // const nativeResult = await wallet.clientSigner.signAndBroadcast(wallet.signer, [sendMsg], 'auto');

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
    <div className="w-full max-w-lg mx-auto p-6 h-[80%] space-y-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-md">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-white">Token Swap</h1>
        <p className="text-gray-400">Quickly and securely swap your favorite tokens</p>
      </div>

      {/* Swap Card */}
      <div className="p-4 rounded-lg bg-gray-900/70 border border-gray-700 shadow-lg">
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-700">
            <Label htmlFor="input-amount" className="text-sm font-medium text-gray-400">You pay</Label>
            <div className="flex mt-2">
              <Input
                id="input-amount"
                type="number"
                placeholder="0.0"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                className="w-2/3 border-0 text-2xl font-semibold bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
              <TokenSelector token={inputToken} setToken={setInputToken} label="Input Token" excludeToken={outputToken} />
            </div>
            <div className="text-sm text-gray-400 mt-1">Balance: {inputToken.symbol === "EGT" ? gameTokenBalance : nativeBalance}</div>
          </div>

          <div className="flex justify-center my-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-gray-700 p-2 hover:bg-gray-600 transition"
              onClick={() => {
                if (inputToken.symbol !== outputToken.symbol) {
                  setInputToken(outputToken)
                  setOutputToken(inputToken)
                  setInputAmount(outputAmount)
                  setOutputAmount(inputAmount)
                }
              }}
            >
              <ArrowDownUp className="h-4 w-4 text-white" />
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-gray-700">
            <Label htmlFor="output-amount" className="text-sm font-medium text-gray-400">You receive</Label>
            <div className="flex mt-2">
              <Input
                id="output-amount"
                type="number"
                placeholder="0.0"
                value={outputAmount}
                readOnly
                className="w-2/3 border-0 text-2xl font-semibold bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
              <TokenSelector token={outputToken} setToken={setOutputToken} label="Output Token" excludeToken={inputToken} />
            </div>
            <div className="text-sm text-gray-400 mt-1">Balance: {outputToken.symbol === "EGT" ? gameTokenBalance : nativeBalance}</div>
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <Button
        className={cn(
          "w-full h-12 mt-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl",
          isSwapping ? "opacity-50 cursor-not-allowed" : "",
          (!inputAmount || inputAmount === '0' || inputToken.symbol === outputToken.symbol) ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "hover:opacity-90"
        )}
        onClick={handleSwap}
        disabled={!inputAmount || inputAmount === '0' || isSwapping || inputToken.symbol === outputToken.symbol}
      >
        {isSwapping ? "Swapping..." : (!inputAmount || inputAmount === '0') ? "Enter an amount" : inputToken.symbol === outputToken.symbol ? "Select different tokens" : "Swap"}
      </Button>
    </div>
  )
}
