import { h } from "tsx-dom";
import { WalletConnectWallet } from '../../types';

export default function WalletButton(wallet: WalletConnectWallet, isLinked?: boolean) {
    const walletBtnId = `btnWallet${wallet.id}`;
    return (
        <button id={walletBtnId}
            class="w-full flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
            <div style={{ width: '44', paddingRight: '5px' }}>
                <img src={wallet.img} alt={wallet.name} style="height: 34px; width: 44px;" />
            </div>
            <div class="flex w-full" style="justify-content: space-between;">
                <span>{wallet.name}</span>
                <span class="text-tether-green">{isLinked ? 'Linked' : ''}</span>
            </div>
        </button>
    ).outerHTML;
}
