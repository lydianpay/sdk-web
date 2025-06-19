import { Checkout } from './ui/Checkout';
import { currencies, isCurrency, InitOptions, Transaction } from './types';

// Register the custom HTML element
if (!customElements.get('lydian-checkout')) {
  customElements.define('lydian-checkout', Checkout);
}

async function init(initOptions: InitOptions) {
  const lydianCheckout = document.querySelector('lydian-checkout') as Checkout;
  if (!initOptions.publishableKey ||
    !initOptions.transaction.amount || !initOptions.transaction.currency) {
    throw new Error('SDK initialization requires a baseURI, publishableKey, and transaction');
  }
  if (!isCurrency(initOptions.transaction.currency)) {
    throw new Error('Invalid value for currency, valid values are: ' + currencies.join(', '));
  }
  await lydianCheckout.getMerchantConfiguration(initOptions);
}

async function updateTransaction(transaction: Transaction) {
  const lydianCheckout = document.querySelector('lydian-checkout') as Checkout;
  await lydianCheckout.updateTransaction(transaction);
}

(window as any).Lydian = { init, updateTransaction };