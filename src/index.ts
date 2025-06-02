import { TetherPayCheckout } from './ui/TetherPayCheckout';
import { currencies, isCurrency, InitOptions, Transaction } from './types';

// Register the custom HTML element
if (!customElements.get('tetherpay-checkout')) {
  customElements.define('tetherpay-checkout', TetherPayCheckout);
}

async function init(initOptions: InitOptions) {
  const tetherPayCheckout = document.querySelector('tetherpay-checkout') as TetherPayCheckout;
  if (!initOptions.publishableKey ||
    !initOptions.transaction.amount || !initOptions.transaction.currency) {
    throw new Error('SDK initialization requires a baseURI, publishableKey, and transaction');
  }
  if (!isCurrency(initOptions.transaction.currency)) {
    throw new Error('Invalid value for currency, valid values are: ' + currencies.join(', '));
  }
  await tetherPayCheckout.getMerchantConfiguration(initOptions);
}

async function updateTransaction(transaction: Transaction) {
  const tetherPayCheckout = document.querySelector('tetherpay-checkout') as TetherPayCheckout;
  await tetherPayCheckout.updateTransaction(transaction);
}

(window as any).TetherPay = { init, updateTransaction };