import { Address } from "viem";

export type QrCodeParams = {
    address: Address;
    uint256: string;
    amount: string;
}

export function parseQrCodeData(uri: string) {
    return uri.split("?")
        .pop()
        ?.split("&")
        .reduce<Record<string, string>>((col, str) => {
            const [key, val] = str.split("=");
            col[key] = val;
            return col;
        }, {}) as QrCodeParams;
}
