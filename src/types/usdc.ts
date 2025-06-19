import { encodeFunctionData } from "viem";
import { Address, EthereumTransactionParams } from "./ethereum";

const USDC_ABI = [
    {
        constant: false,
        inputs: [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        type: "function",
    },
];

export const USDC_ERC20_MAIN = {
    contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" as Address,
    abi: USDC_ABI,
    multiplier: 1000000,
};

export function encodeEthereumUsdcTransfer({
    fromAddress,
    toAddress,
    uint256
}: {
    fromAddress: Address;
    toAddress: Address;
    uint256: number;
}): EthereumTransactionParams {
    // const valueInWei = BigInt(value) * BigInt(10 ** 6); // Assuming USDC has 6 decimals
    return {
        from: fromAddress,
        to: USDC_ERC20_MAIN.contractAddress,
        data: encodeFunctionData({
            abi: USDC_ERC20_MAIN.abi,
            functionName: 'transfer',
            args: [toAddress, uint256]
        })
    }
}
