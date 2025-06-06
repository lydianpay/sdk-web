import { CreateTransactionResponse } from 'src/types';
import { encodeFunctionData } from 'viem';

export type Address = `0x${string}`;

export type QrCodeParams = {
    address: string;
    uint256: string;
    amount: string;
}

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

declare global {
    interface WindowEventMap {
        "eip6963:announceProvider": CustomEvent
    }
}

// Connect to the selected provider using eth_requestAccounts.
const connectWithProvider = async (
    wallet: EIP6963AnnounceProviderEvent["detail"],
    txn?: CreateTransactionResponse
) => {
    try {
        const res = await wallet.provider.request({ method: "eth_requestAccounts" }) as string[];

        if (txn) {
            const params = txn.qrData
                .split("?")
                .pop()
                ?.split("&")
                .reduce<Record<string, string>>((col, str) => {
                    const [key, val] = str.split("=");
                    col[key] = val;
                    return col;
                }, {}) as QrCodeParams;

            wallet.provider
                .request({
                    method: "eth_sendTransaction",
                    params: [
                        {
                            from: res[0], // The user's active address.
                            to: USDT_ERC20_MAIN.contractAddress, // Address of the recipient. Not used in contract creation transactions.
                            // value: "0x1e6", // Value transferred, in wei. Only required to send ether to the recipient from the initiating external account.
                            gasLimit: "0x5028", // Customizable by the user during MetaMask confirmation.
                            maxPriorityFeePerGas: "0x3b9aca00", // Customizable by the user during MetaMask confirmation.
                            maxFeePerGas: "0x2540be400", // Customizable by the user during MetaMask confirmation.
                            data: encodeFunctionData({
                                abi: USDT_ERC20_MAIN.abi,
                                functionName: 'transfer',
                                args: [params.address, parseInt(params.uint256)]
                            })
                        },
                    ],
                })
                .then((txHash) => console.log(txHash))
                .catch((error) => console.error(error));
        }
    } catch (error) {
        console.error("Failed to connect to provider:", error)
    }
}

// Display detected providers as connect buttons.
export function listProviders(element: HTMLDivElement, txn?: CreateTransactionResponse) {
    window.addEventListener(
        "eip6963:announceProvider",
        (event: EIP6963AnnounceProviderEvent) => {
            const button = document.createElement("button")

            button.innerHTML = `
        <button id="${event.detail.info.name}Button"
            class="w-full flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
            <img src="${event.detail.info.icon}" alt="${event.detail.info.name}" style="height: 34px; width: 44px;" />
            <span>${event.detail.info.name}</span>
        </button>
      `

            // Call connectWithProvider when a user selects the button.
            button.onclick = () => connectWithProvider(event.detail, txn)
            element.appendChild(button)
        }
    )

    // Notify event listeners and other parts of the dapp that a provider is requested.
    window.dispatchEvent(new Event("eip6963:requestProvider"))
}
