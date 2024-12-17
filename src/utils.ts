import QrCode from 'qrcode';
import { QRCodeDefaults } from "./constants";

/**
 * Applies the properties and methods of the base classes to the derived class
 * @param derivedCtor - The derived class
 * @param baseCtors - An array of base classes
 */
export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      );
    });
  });
}

export function extractCountryCodeFromUrl(url: string) {
  const origin = url.split('://').pop();
  const [country] = origin.split('-');
  return country.toUpperCase();
}

export function renderQrCode(elementId: string = 'tpg-payment-code', qrData: string) {
  const paymentCodeContainer = document.getElementById(elementId);
  if (!paymentCodeContainer) {
    console.error(`cannot find element with id ${elementId}`);
    return;
  }

  const paymentCodeElem = document.createElement('canvas');
  QrCode.toDataURL(paymentCodeElem, `${qrData}`, QRCodeDefaults);

  paymentCodeContainer.appendChild(paymentCodeElem);
}
