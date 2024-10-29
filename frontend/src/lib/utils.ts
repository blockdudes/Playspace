import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PinataSDK } from "pinata-web3"
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { accounts } from "@/admin/signer";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: "tomato-characteristic-quail-246.mypinata.cloud",
})


export const uploadImageToPinata = async (file: File) => {
  try {
    const upload = await pinata.upload.file(file);
    console.log(upload);
    return upload.IpfsHash;
  } catch (error) {
    console.error("Error uploading image to Pinata:", error);
    throw error;
  }
};

export const approveTokens = async (amount: number, wallet: any) => {
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
    }
  }
}

export const transferFromTokens = async (amount: number, wallet: any, adminClient: any) => {
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