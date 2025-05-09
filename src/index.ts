import {TetherPayCheckout} from './ui/TetherPayCheckout';
import {currencies, isCurrency, TetherPayOptions, Transaction} from "./types";

// Register the custom HTML element
if (!customElements.get('tetherpay-checkout')) {
    customElements.define('tetherpay-checkout', TetherPayCheckout);
}

function init(tetherPayOptions: TetherPayOptions): void {
    const tetherPayCheckout = document.querySelector('tetherpay-checkout') as TetherPayCheckout;
    if (!tetherPayOptions.baseUri || !tetherPayOptions.publishableKey ||
        !tetherPayOptions.initialTransaction.amount || !tetherPayOptions.initialTransaction.currency) {
        throw new Error('Tether Pay initialization requires a baseUri, publishableKey, and initial transaction');
    }
    if (!isCurrency(tetherPayOptions.initialTransaction.currency)) {
        throw new Error('Invalid value for currency, valid values are: ' + currencies.join(', '));
    }
    tetherPayCheckout.setTetherPayOptions(tetherPayOptions);
}

function updateTransaction(transaction: Transaction): void {
    const tetherPayCheckout = document.querySelector('tetherpay-checkout') as TetherPayCheckout;
    tetherPayCheckout.updateTransaction(transaction);
}

(window as any).TetherPay = {init, updateTransaction};