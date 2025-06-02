import { h } from "tsx-dom";
import { Asset } from '../../types';


export default function AssetButton(asset : Asset) {
    const assetCode = `btnAsset${asset.code}`
    return (
        <button id={assetCode}
            class="w-full flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
            <img src={asset.img} alt={asset.title} style="height: 34px; width: 44px;" />
            <span>{asset.title}</span>
        </button>
    ).outerHTML;
}
