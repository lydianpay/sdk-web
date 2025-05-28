import tetherPayCSS from './tetherpay.generated.css?inline';
import checkoutTemplate from './checkout-template.html?raw';
import {
  CreateCryptoTransactionResponse,
  CryptoTransaction,
  currencies,
  GetSDKConfigResponse,
  isCurrency,
  TetherPayOptions,
  Asset,
} from '../types';
import QrCode from 'qrcode';
import {
  AllowedAssetBitcoin,
  AllowedAssetEthereum,
  AllowedAssetUSDC,
  AllowedAssetUSDT,
  BaseUrlProduction,
  BaseUrlSandbox,
  CryptoPaymentChainAptos,
  CryptoPaymentChainAvalanche,
  CryptoPaymentChainEthereum,
  CryptoPaymentChainSolana,
  CryptoPaymentChainTon,
  CryptoPaymentChainTron,
  CryptoTransactionStatusSuccess,
  QRCodeDefaults,
} from '../constants';
import { TetherPayApi } from '../network';
import isMobile from 'is-mobile';

import CryptoAssetButton from './buttons/cryptoAssetButton';

export class TetherPayCheckout extends HTMLElement {
  private shadow: ShadowRoot;
  private tetherPayOptions: TetherPayOptions | null = null;

  private sdkConfig: GetSDKConfigResponse | null = null;
  private cryptoTransaction: CreateCryptoTransactionResponse | null = null;
  private tetherPayApi: TetherPayApi | null = null;
  private getCryptoTransactionIntervalID: NodeJS.Timeout | null = null;

  private tetherPayUsdtPaymentContainer: HTMLDivElement | null = null;
  private tetherPayUsdtAdditionalPaymentContainer: HTMLDivElement | null = null;
  private tetherPayChainsContainer: HTMLDivElement | null = null;
  private tetherPayPaymentSuccessContainer: HTMLDivElement | null = null;
  private tetherPayPaymentFailedContainer: HTMLDivElement | null = null;
  private tetherPayQRCodeContainer: HTMLDivElement | null = null;
  private tetherPayProcessingContainer: HTMLDivElement | null = null;

  private tetherPayCryptoPaymentContainer: HTMLDivElement | null = null;
  private tetherPayCryptoAssetsContainer: HTMLDivElement | null = null;
  private tetherPayCryptoAssetsAdditionalContainer: HTMLDivElement | null = null;
  private tetherPayBtnCryptoAssetsAdditionalPayment: HTMLButtonElement | null = null;
  private tetherPayBtnCancelCryptoPayment: HTMLButtonElement | null = null;

  private tetherPayQRCodeCanvas: HTMLCanvasElement | null = null;

  private tetherPayUSDTAmount: HTMLParagraphElement | null = null;

  private tetherPayBtnClusterPayment: HTMLButtonElement | null = null;
  private tetherPayBtnCryptoPayment: HTMLButtonElement | null = null;
  private tetherPayBtnUsdtAdditionalPayment: HTMLButtonElement | null = null;
  private tetherPayBtnEthereumPayment: HTMLButtonElement | null = null;
  private tetherPayBtnTronPayment: HTMLButtonElement | null = null;
  private tetherPayBtnSolanaPayment: HTMLButtonElement | null = null;
  private tetherPayBtnTonPayment: HTMLButtonElement | null = null;
  private tetherPayBtnAvalanchePayment: HTMLButtonElement | null = null;
  private tetherPayBtnAptosPayment: HTMLButtonElement | null = null;

  private tetherPayBtnUsdtPayment: HTMLButtonElement | null = null;
  private tetherPayBtnCancelUsdtPayment: HTMLButtonElement | null = null;

  private selectedAssetCode: string | null = null;
  private selectedAssetNetworks: string[] | null = null;
  private selectedNetwork: string | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  public async setTetherPayOptions(options: TetherPayOptions) {
    this.tetherPayOptions = options;
    this.tetherPayApi = new TetherPayApi(options.sandbox ? BaseUrlSandbox : BaseUrlProduction, this.tetherPayOptions.publishableKey);
    await this.getSDKConfig();
    this.render();
    this.initializeComponents();
    this.attachListeners();
    this.updateUI();
  }

  public async updateTransaction(transaction: CryptoTransaction) {
    if (!this.tetherPayOptions) {
      throw new Error('Tether Pay not initialized.');
    }
    if (!transaction.amount || !transaction.currency) {
      throw new Error('Amount and currency are required.');
    }
    if (!isCurrency(transaction.currency)) {
      throw new Error('Invalid value for currency, valid values are: ' + currencies.join(', '));
    }
    this.tetherPayOptions.initialTransaction = transaction;
    this.loadInitialState();
  }

  private loadInitialState(): void {
    this.showButtons();
    this.hidePaymentSuccess();
    this.hideProcessing();
    this.hideQRCode();
    this.tetherPayUsdtPaymentContainer?.classList.add('hidden');
    this.clearInterval();
    this.setSelectedAssetCode(null);
    this.setSelectedNetwork(null);

    // Pay with crypto container initial state
    this.tetherPayCryptoPaymentContainer?.classList.add('hidden');
    this.tetherPayCryptoAssetsAdditionalContainer?.classList.add('hidden');
    this.tetherPayBtnCryptoAssetsAdditionalPayment?.classList.remove('hidden');

    // Pay with USDT container initial state
    this.tetherPayUsdtAdditionalPaymentContainer?.classList.add('hidden');
    this.tetherPayBtnUsdtAdditionalPayment?.classList.remove('hidden');
  }

  private setSelectedAssetCode(code: string | null) {
    this.selectedAssetCode = code;
  }

  private setSelectedNetwork(network: string | null) {
    this.selectedNetwork = network;
  }

  private showPaymentSuccess(): void {
    this.tetherPayPaymentSuccessContainer?.classList.remove('hidden');
    this.hideProcessing();
    this.hideButtons();
    this.hideQRCode();
  }

  private showPaymentFailure(): void {
    this.tetherPayPaymentFailedContainer?.classList.remove('hidden');
    this.hideProcessing();
    this.hideButtons();
    this.hideQRCode();
  }

  private hidePaymentSuccess(): void {
    this.tetherPayPaymentSuccessContainer?.classList.add('hidden');
  }

  private showProcessing(): void {
    this.tetherPayProcessingContainer?.classList.remove('hidden');
  }

  private hideProcessing(): void {
    this.tetherPayProcessingContainer?.classList.add('hidden');
  }

  private showButtons(): void {
    if (this.sdkConfig?.tetherPayEnabled) {
      this.tetherPayBtnClusterPayment?.classList.remove('hidden');
    }
    if (this.sdkConfig?.cryptoPayEnabled) {
      this.tetherPayBtnCryptoPayment?.classList.remove('hidden');
    }
  }

  private hideButtons(): void {
    this.tetherPayBtnClusterPayment?.classList.add('hidden');
    this.tetherPayBtnCryptoPayment?.classList.add('hidden');
    this.tetherPayUsdtPaymentContainer?.classList.add('hidden');
    this.tetherPayCryptoPaymentContainer?.classList.add('hidden');
  }

  private showQRCode(qrData: string, usdtAmount: number): void {
    this.tetherPayQRCodeContainer?.classList.remove('hidden');
    if (this.tetherPayUSDTAmount) {
      this.tetherPayUSDTAmount.innerText = 'USDT AMOUNT ' + usdtAmount;
    }
    if (this.tetherPayQRCodeCanvas) {
      if (this.tetherPayQRCodeCanvas?.parentElement) {
        let qrCodeWidth = this.tetherPayQRCodeCanvas.parentElement.clientWidth;
        const computedStyle = window.getComputedStyle(this.tetherPayQRCodeCanvas.parentElement, null);
        qrCodeWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        QRCodeDefaults.width = qrCodeWidth;
      }
      QrCode.toDataURL(this.tetherPayQRCodeCanvas, qrData, QRCodeDefaults);
    }
  }

  private hideQRCode(): void {
    this.tetherPayQRCodeContainer?.classList.add('hidden');
    if (this.tetherPayQRCodeCanvas) {
      const ctx = this.tetherPayQRCodeCanvas.getContext('2d');
      ctx?.clearRect(0, 0, this.tetherPayQRCodeCanvas.width, this.tetherPayQRCodeCanvas.height);
    }
  }

  private render(): void {
    this.shadow.innerHTML = `<style>${tetherPayCSS}</style>${checkoutTemplate}`;
  }

  private initializeComponents(): void {
    this.tetherPayUsdtPaymentContainer = this.shadowRoot?.getElementById('tetherPayUsdtPaymentContainer') as HTMLDivElement;
    this.tetherPayUsdtAdditionalPaymentContainer = this.shadowRoot?.getElementById('tetherPayUsdtAdditionalPaymentContainer') as HTMLDivElement;
    this.tetherPayChainsContainer = this.shadowRoot?.getElementById('tetherPayChainsContainer') as HTMLDivElement;
    this.tetherPayPaymentSuccessContainer = this.shadowRoot?.getElementById('tetherPayPaymentSuccessContainer') as HTMLDivElement;
    this.tetherPayPaymentFailedContainer = this.shadowRoot?.getElementById('tetherPayPaymentFailedContainer') as HTMLDivElement;
    this.tetherPayQRCodeContainer = this.shadowRoot?.getElementById('tetherPayQRCodeContainer') as HTMLDivElement;
    this.tetherPayProcessingContainer = this.shadowRoot?.getElementById('tetherPayProcessingContainer') as HTMLDivElement;

    this.tetherPayCryptoPaymentContainer = this.shadowRoot?.getElementById('tetherPayCryptoPaymentContainer') as HTMLDivElement;
    this.tetherPayCryptoAssetsContainer = this.shadowRoot?.getElementById('tetherPayCryptoAssetsContainer') as HTMLDivElement;
    this.tetherPayCryptoAssetsAdditionalContainer = this.shadowRoot?.getElementById('tetherPayCryptoAssetsAdditionalContainer') as HTMLDivElement;

    this.tetherPayQRCodeCanvas = this.shadowRoot?.getElementById('tetherPayQRCodeCanvas') as HTMLCanvasElement;

    this.tetherPayUSDTAmount = this.shadowRoot?.getElementById('tetherPayUSDTAmount') as HTMLParagraphElement;

    this.tetherPayBtnClusterPayment = this.shadowRoot?.getElementById('tetherPayBtnClusterPayment') as HTMLButtonElement;
    this.tetherPayBtnCryptoPayment = this.shadowRoot?.getElementById('tetherPayBtnCryptoPayment') as HTMLButtonElement;
    this.tetherPayBtnUsdtAdditionalPayment = this.shadowRoot?.getElementById('tetherPayBtnUsdtAdditionalPayment') as HTMLButtonElement;
    this.tetherPayBtnCancelCryptoPayment = this.shadowRoot?.getElementById('tetherPayBtnCancelCryptoPayment') as HTMLButtonElement;
    this.tetherPayBtnCryptoAssetsAdditionalPayment = this.shadowRoot?.getElementById('tetherPayBtnCryptoAssetsAdditionalPayment') as HTMLButtonElement;
  }

  private updateUI(): void {
    if (!this.sdkConfig?.tetherPayEnabled) {
      this.tetherPayBtnClusterPayment?.classList.add('hidden');
    }
    if (!this.sdkConfig?.cryptoPayEnabled) {
      this.tetherPayBtnCryptoPayment?.classList.add('hidden');
    }
  }

  private attachListeners(): void {
    this.tetherPayBtnClusterPayment?.addEventListener('click', (e) => {
      console.log('TODO: NOT IMPLEMENTED');
    });

    this.tetherPayBtnCryptoPayment?.addEventListener('click', () => {
      this.tetherPayBtnCryptoPayment?.classList.toggle('hidden');
      this.tetherPayCryptoPaymentContainer?.classList.toggle('hidden');
      this.updateCryptoAssetButtons();
    });

    this.tetherPayBtnUsdtAdditionalPayment?.addEventListener('click', () => {
      this.tetherPayUsdtAdditionalPaymentContainer?.classList.toggle('hidden');
      this.tetherPayBtnUsdtAdditionalPayment?.classList.toggle('hidden');
    });

    this.tetherPayBtnCryptoAssetsAdditionalPayment?.addEventListener('click', () => {
      this.tetherPayCryptoAssetsAdditionalContainer?.classList.toggle('hidden');
      this.tetherPayBtnCryptoAssetsAdditionalPayment?.classList.toggle('hidden');
    });

    this.tetherPayBtnCancelCryptoPayment?.addEventListener('click', () => {
      this.loadInitialState();
    });
  }

  private async createCryptoTransaction() {
    if (!this.selectedAssetCode || !this.selectedNetwork) {
      this.tetherPayOptions?.paymentFailedListener?.('Asset and network selection required.');
      return;
    }

    if (this.tetherPayOptions && this.tetherPayApi) {
      this.clearInterval();
      this.hideButtons();
      this.showProcessing();
      try {
        this.cryptoTransaction = await this.tetherPayApi.createCryptoTransaction({
          descriptor: this.tetherPayOptions.initialTransaction.descriptor,
          referenceNumber: this.tetherPayOptions.initialTransaction.referenceNumber,
          amount: this.tetherPayOptions.initialTransaction.amount,
          amountCurrency: this.tetherPayOptions.initialTransaction.currency,
          asset: this.selectedAssetCode,
          network: this.selectedNetwork,
        });
        this.showQRCode(this.cryptoTransaction.qrData, this.cryptoTransaction.assetAmount);
        this.startListeningCryptoTransaction();
        if (isMobile()) {
          window.location.href = this.cryptoTransaction.qrData;
        }
      } catch (error) {
        this.tetherPayOptions?.paymentFailedListener?.('Unable to create cryptotransaction.');
      }
    } else {
      this.tetherPayOptions?.paymentFailedListener?.('Tether Pay not initialized.');
    }
  }

  private async updateCryptoTransaction(chain: string) {
    this.clearInterval();
    this.hideButtons();
    this.showProcessing();
    if (this.tetherPayApi && this.cryptoTransaction?.transactionId) {
      try {
        const response = await this.tetherPayApi.updateCryptoTransaction(this.cryptoTransaction.transactionId, {
          chain: chain,
        });
        this.showQRCode(response.qrData, response.usdtAmount);
        this.startListeningCryptoTransaction();
        if (isMobile()) {
          window.location.href = response.qrData;
        }
      } catch (e) {
        this.loadInitialState();
        this.tetherPayOptions?.paymentFailedListener?.('Unable to create cryptotransaction.');
      }
    } else {
      this.loadInitialState();
      this.tetherPayOptions?.paymentFailedListener?.('Tether Pay not initialized.');
    }
  }

  private startListeningCryptoTransaction() {
    this.clearInterval();
    this.getCryptoTransactionIntervalID = setInterval(async () => {
      if (this.cryptoTransaction?.transactionId) {
        const transaction = await this.tetherPayApi?.getCryptoTransaction(this.cryptoTransaction?.transactionId);
        if (transaction) {
          if (transaction.status === CryptoTransactionStatusSuccess) {
            this.showPaymentSuccess();
            this.clearInterval();
          }
          const expirationDateTime = Date.parse(transaction.expiration);
          const currentDateTime = Date.now();
          if (expirationDateTime < currentDateTime) {
            this.showPaymentFailure();
            this.clearInterval();
            this.tetherPayOptions?.paymentFailedListener?.('Transaction Timed Out / Failed!');
          }
        }
      }
    }, 2000);
  }

  private clearInterval() {
    if (this.getCryptoTransactionIntervalID) {
      clearInterval(this.getCryptoTransactionIntervalID);
      this.getCryptoTransactionIntervalID = null;
    }
  }

  private updateCryptoAssetButtons() {
    if (!this.tetherPayCryptoAssetsContainer || !this.tetherPayCryptoAssetsAdditionalContainer) {
      return;
    }

    this.tetherPayCryptoAssetsContainer.innerHTML = '';
    this.tetherPayCryptoAssetsAdditionalContainer.innerHTML = '';

    const buttons = this.sdkConfig?.allowedAssets.map((asset, index) => {
      switch (asset.code) {
        case AllowedAssetBitcoin:
          return CryptoAssetButton({
            id: '',
            assetName: 'Bitcoin',
            imgSrc: "https://tetherpay.com/images/327ef8ac-bc72-46ea-2362-878e91c49300/public",
          });
        case AllowedAssetEthereum:
          return CryptoAssetButton({
            id: 'tetherPayBtnAssetEthereumPayment',
            assetName: 'Ethereum',
            imgSrc: "https://tetherpay.com/images/327ef8ac-bc72-46ea-2362-878e91c49300/public"
          });
        case AllowedAssetUSDT:
          return CryptoAssetButton({
            id: 'tetherPayBtnUsdtPayment',
            assetName: 'USDT',
            imgSrc: "https://tetherpay.com/images/7065960c-8ebd-4d80-f352-8027ff2bb600/public"
          });
        case AllowedAssetUSDC:
          return CryptoAssetButton({
            id: 'tetherPayBtnUsdcPayment',
            assetName: 'USDC',
            imgSrc: "https://tetherpay.com/images/7065960c-8ebd-4d80-f352-8027ff2bb600/public"
          });
      }
    });

    buttons?.filter(v => v).forEach((button, index) => {
      if (index >= 2 && this.tetherPayCryptoAssetsAdditionalContainer) {
        this.tetherPayCryptoAssetsAdditionalContainer.innerHTML += button;
      } else if (this.tetherPayCryptoAssetsContainer) {
        this.tetherPayCryptoAssetsContainer.innerHTML += button;
      }
    })

    if (this.sdkConfig?.allowedAssets && this.sdkConfig.allowedAssets.length <= 2) {
      this.tetherPayBtnCryptoAssetsAdditionalPayment?.classList.add('hidden');
    }

    this.initializeAndAttachListenersOnAssets();
  }

  private initializeAndAttachListenersOnAssets() {
    this.tetherPayBtnUsdtPayment = this.shadowRoot?.getElementById('tetherPayBtnUsdtPayment') as HTMLButtonElement;

    this.tetherPayBtnUsdtPayment?.addEventListener('click', async () => {
      this.selectedAssetCode = AllowedAssetUSDT;

      this.tetherPayCryptoPaymentContainer?.classList.add('hidden');
      this.tetherPayUsdtPaymentContainer?.classList.remove('hidden');
      this.updateChainButtons();      
    });
  }

  private updateChainButtons() {
    if (!this.tetherPayChainsContainer || !this.tetherPayUsdtAdditionalPaymentContainer) {
      return;
    }
    this.tetherPayChainsContainer.innerHTML = '';
    this.tetherPayUsdtAdditionalPaymentContainer.innerHTML = '';

    console.log('selectedAssetCode', this.selectedAssetCode);
    const asset = this.sdkConfig?.allowedAssets.find(a => a.code === this.selectedAssetCode);
    console.log('asset', asset)

    asset?.networks.forEach((chain, index) => {
      let button;
      switch (chain) {
        case CryptoPaymentChainEthereum:
          button = CryptoAssetButton({
            id: 'tetherPayBtnEthereumPayment',
            assetName: 'Ethereum',
            imgSrc: "https://tetherpay.com/images/327ef8ac-bc72-46ea-2362-878e91c49300/public"
          });
          break;

        case CryptoPaymentChainTron:
          button = CryptoAssetButton({
            id: 'tetherPayBtnTronPayment',
            assetName: 'Tron',
            imgSrc: "https://tetherpay.com/images/b51f79ea-c12b-4c01-246d-592c51214000/public"
          });
          break;

        case CryptoPaymentChainSolana:
          button = CryptoAssetButton({
            id: 'tetherPayBtnSolanaPayment',
            assetName: 'Solana',
            imgSrc: "https://tetherpay.com/images/5850fc57-4451-4f45-b053-3857b1d54e00/public"
          });
          break;

        case CryptoPaymentChainTon:
          button = CryptoAssetButton({
            id: 'tetherPayBtnTonPayment',
            assetName: 'Ton',
            imgSrc: "https://tetherpay.com/images/a741a20b-6124-4c69-e678-4578b81a5f00/public"
          });
          break;

        case CryptoPaymentChainAvalanche:
          button = CryptoAssetButton({
            id: 'tetherPayBtnAvalanchePayment',
            assetName: 'Avalanche',
            imgSrc: "https://tetherpay.com/images/ebd47494-9bae-4687-7762-19a4184e5400/public"
          });
          break;

        case CryptoPaymentChainAptos:
          button = CryptoAssetButton({
            id: 'tetherPayBtnAptosPayment',
            assetName: 'Aptos',
            imgSrc: "https://tetherpay.com/images/f2b2a145-2c37-4082-5f18-6271081d1500/public"
          });
          break;
      }
      if (index >= 2 && this.tetherPayUsdtAdditionalPaymentContainer) {
        this.tetherPayUsdtAdditionalPaymentContainer.innerHTML += button;
      } else if (this.tetherPayChainsContainer) {
        this.tetherPayChainsContainer.innerHTML += button;
      }
    });

    if (asset?.networks && asset?.networks.length <= 2) {
      this.tetherPayBtnUsdtAdditionalPayment?.classList.add('hidden');
    }

    this.initializeAndAttachListenersOnChain();
  }

  private initializeAndAttachListenersOnChain() {
    this.tetherPayBtnEthereumPayment = this.shadowRoot?.getElementById('tetherPayBtnEthereumPayment') as HTMLButtonElement;
    this.tetherPayBtnTronPayment = this.shadowRoot?.getElementById('tetherPayBtnTronPayment') as HTMLButtonElement;
    this.tetherPayBtnSolanaPayment = this.shadowRoot?.getElementById('tetherPayBtnSolanaPayment') as HTMLButtonElement;
    this.tetherPayBtnTonPayment = this.shadowRoot?.getElementById('tetherPayBtnTonPayment') as HTMLButtonElement;
    this.tetherPayBtnAvalanchePayment = this.shadowRoot?.getElementById('tetherPayBtnAvalanchePayment') as HTMLButtonElement;
    this.tetherPayBtnAptosPayment = this.shadowRoot?.getElementById('tetherPayBtnAptosPayment') as HTMLButtonElement;
    this.tetherPayBtnCancelUsdtPayment = this.shadowRoot?.getElementById('tetherPayBtnCancelUsdtPayment') as HTMLButtonElement;

    this.tetherPayBtnEthereumPayment?.addEventListener('click', async () => {
      // await this.updateCryptoTransaction(CryptoPaymentChainEthereum);
      this.selectedNetwork = CryptoPaymentChainEthereum;
      await this.createCryptoTransaction();
    });
    this.tetherPayBtnTronPayment?.addEventListener('click', async () => {
      await this.updateCryptoTransaction(CryptoPaymentChainTron);
    });
    this.tetherPayBtnSolanaPayment?.addEventListener('click', async () => {
      await this.updateCryptoTransaction(CryptoPaymentChainSolana);
    });
    this.tetherPayBtnTonPayment?.addEventListener('click', async () => {
      await this.updateCryptoTransaction(CryptoPaymentChainTon);
    });
    this.tetherPayBtnAvalanchePayment?.addEventListener('click', async () => {
      await this.updateCryptoTransaction(CryptoPaymentChainAvalanche);
    });
    this.tetherPayBtnAptosPayment?.addEventListener('click', async () => {
      await this.updateCryptoTransaction(CryptoPaymentChainAptos);
    });

    this.tetherPayBtnCancelUsdtPayment?.addEventListener('click', async () => {
      this.loadInitialState();
    });
  }

  private async getSDKConfig() {
    if (this.tetherPayApi) {
      try {
        this.sdkConfig = await this.tetherPayApi.getSDKConfig();
        this.tetherPayApi.setClusterBaseUri(this.sdkConfig.tetherPayCluster);
      } catch (error) {
        this.tetherPayOptions?.paymentFailedListener?.('Unable to load SDK configuration.');
      }
    } else {
      this.tetherPayOptions?.paymentFailedListener?.('Tether Pay not initialized.');
    }
  }
}
