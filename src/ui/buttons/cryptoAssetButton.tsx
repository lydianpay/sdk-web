import { h } from "tsx-dom";

interface CryptoAssetButtonProps {
    id: string;
    assetName: string;
    imgSrc: string;
}

export default function CryptoAssetButton({
    id,
    assetName,
    imgSrc,
}: CryptoAssetButtonProps) {
    return (
        <button id={id}
            class="w-full flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
            <img src={imgSrc} alt={assetName} style="height: 34px; width: 44px;" />
            <span>{assetName}</span>
        </button>
    ).outerHTML;
}
