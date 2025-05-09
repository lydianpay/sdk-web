import {TetherPayCheckout} from './ui/TetherPayCheckout';
import {TetherPayOptions} from "./types";

// Register the custom HTML element
if (!customElements.get('tetherpay-checkout')) {
    customElements.define('tetherpay-checkout', TetherPayCheckout);
}

function init(tetherPayOptions: TetherPayOptions) {
    const tetherPayCheckout = document.querySelector('tetherpay-checkout') as TetherPayCheckout;
    tetherPayCheckout.setTetherPayOptions(tetherPayOptions);
}

function displayPaymentSuccess(): void {
    const tetherPayCheckout = document.querySelector('tetherpay-checkout') as TetherPayCheckout;
    tetherPayCheckout.displayPaymentSuccess();
}

function displayProcessing(): void {
    const tetherPayCheckout = document.querySelector('tetherpay-checkout') as TetherPayCheckout;
    tetherPayCheckout.displayProcessing();
}

function hideProcessing(): void {
    const tetherPayCheckout = document.querySelector('tetherpay-checkout') as TetherPayCheckout;
    tetherPayCheckout.hideProcessing();
}

function displayButtons(): void {
    const tetherPayCheckout = document.querySelector('tetherpay-checkout') as TetherPayCheckout;
    tetherPayCheckout.displayButtons();
}

function hideButtons(): void {
    const tetherPayCheckout = document.querySelector('tetherpay-checkout') as TetherPayCheckout;
    tetherPayCheckout.hideButtons();
}

function displayQRCode(qrData: string): void {
    const tetherPayCheckout = document.querySelector('tetherpay-checkout') as TetherPayCheckout;
    tetherPayCheckout.displayQRCode(qrData);
}

function hideQRCode(): void {
    const tetherPayCheckout = document.querySelector('tetherpay-checkout') as TetherPayCheckout;
    tetherPayCheckout.hideQRCode();
}

(window as any).TetherPay = { init, displayPaymentSuccess, displayProcessing, hideProcessing, displayButtons, hideButtons, displayQRCode, hideQRCode };