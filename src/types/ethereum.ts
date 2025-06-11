import { EncodeFunctionDataReturnType } from "viem";

export type Address = `0x${string}`;

export interface EthereumTransactionParams {
    from: Address;  // Users wallet address
    to: Address; // Contract or recipient address
    value?: `0x${string}`; // Value transferred, in wei. Only required to send ether to the recipient from the initiating external account.
    gasLimit?: `0x${string}`; // Customizable by the user during confirmation.
    maxPriorityFeePerGas?: `0x${string}`; // Customizable by the user during confirmation.
    maxFeePerGas?: `0x${string}`; // Customizable by the user during confirmation.
    data: EncodeFunctionDataReturnType;
}
