import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";
import axios from "axios";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";

const options = {
    rpcEndpoint: "https://rpc.constantine.archway.io",
    gasPrice: "0.025uconst",
    chainId: "constantine-3",
    fees: {
        upload: 20000000
    }
};

const mnemonic = "cattle boat useless rib few stumble robust arrive early pledge tortoise clip";
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "archway" });
const gasPrice = GasPrice.fromString(options.gasPrice);
export const [accounts] = await wallet.getAccounts();
console.log(accounts)
export const adminClient = await SigningCosmWasmClient.connectWithSigner(options.rpcEndpoint, wallet, { gasPrice });