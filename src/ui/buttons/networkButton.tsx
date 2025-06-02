import { h } from "tsx-dom";
import { Network } from '../../types';


export default function NetworkButton(network: Network) {
    const networkID = `btnNetwork${network.code}`
    return (
        <button id={networkID}
            class="w-full flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
            <img src={network.img} alt={network.name} style="height: 34px; width: 44px;" />
            <span>{network.name}</span>
        </button>
    ).outerHTML;
}
