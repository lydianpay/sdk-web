import { TetherPayCheckout } from './ui/TetherPayCheckout';
import { currencies, isCurrency, TetherPayOptions, CryptoTransaction } from './types';

// Register the custom HTML element
if (!customElements.get('tetherpay-checkout')) {
  customElements.define('tetherpay-checkout', TetherPayCheckout);
}

async function init(tetherPayOptions: TetherPayOptions) {
  const tetherPayCheckout = document.querySelector('tetherpay-checkout') as TetherPayCheckout;
  if (!tetherPayOptions.publishableKey ||
    !tetherPayOptions.initialTransaction.amount || !tetherPayOptions.initialTransaction.currency) {
    throw new Error('Tether Pay initialization requires a baseUri, publishableKey, and initial cryptotransaction');
  }
  if (!isCurrency(tetherPayOptions.initialTransaction.currency)) {
    throw new Error('Invalid value for currency, valid values are: ' + currencies.join(', '));
  }
  await tetherPayCheckout.setTetherPayOptions(tetherPayOptions);
}

async function updateTransaction(transaction: CryptoTransaction) {
  const tetherPayCheckout = document.querySelector('tetherpay-checkout') as TetherPayCheckout;
  await tetherPayCheckout.updateTransaction(transaction);
}

(window as any).TetherPay = { init, updateTransaction };