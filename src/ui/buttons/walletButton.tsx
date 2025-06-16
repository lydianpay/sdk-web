import { h } from "tsx-dom";
import { WalletConnectWallet } from '../../types';

export default function WalletButton(wallet: WalletConnectWallet) {
    const walletBtnId = `btnWallet${wallet.name}`
    return (
        <button id={walletBtnId}
            class="w-full flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
            <img src={wallet.img} alt={wallet.name} style="height: 34px; width: 44px;" />
            <span>{wallet.name}</span>
        </button>
    ).outerHTML;
}
