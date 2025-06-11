import { encodeFunctionData } from "viem";
import { Address, EthereumTransactionParams } from "./ethereum";

const USDT_ABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "recipient",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
];

export const USDT_ERC20_MAIN = {
    contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7" as Address,
    abi: USDT_ABI,
    multiplier: 1000000,
};

export function encodeEthereumUsdtTransfer({
    fromAddress,
    toAddress,
    uint256
}: {
    fromAddress: Address;
    toAddress: Address;
    uint256: number;
}): EthereumTransactionParams {
    return {
        from: fromAddress,
        to: USDT_ERC20_MAIN.contractAddress,
        data: encodeFunctionData({
            abi: USDT_ERC20_MAIN.abi,
            functionName: 'transfer',
            args: [toAddress, uint256]
        })
    }
}
