import lydianCSS from './lydian.generated.css?inline';
import checkoutTemplate from './checkout-template.html?raw';
import {
  CreateTransactionResponse,
  Transaction,
  currencies,
  GetSDKConfigResponse,
  isCurrency,
  InitOptions,
  Asset,
  WalletConnectWallet,
} from '../types';
import {
  AllowedAssetBitcoin,
  AllowedAssetEthereum,
  AllowedAssetUSDC,
  AllowedAssetUSDT,
  BaseUrlProduction,
  BaseUrlSandbox,
  NetworkAptos,
  NetworkAvalanche,
  NetworkEthereum,
  NetworkSolana,
  NetworkTon,
  NetworkTron,
  CryptoTransactionStatusSuccess,
  AssetBitcoin,
  AssetEthereum,
  AssetUSDT,
  AssetUSDC,
  AllowedNetworkEthereum,
  AllowedNetworkTron,
  NetworkBitcoin,
  AllowedNetworkBitcoin, AllowedNetworkSolana, AllowedNetworkTon, AllowedNetworkAvalanche, AllowedNetworkAptos,
} from '../constants';
import { API } from '../network';
import isMobile from 'is-mobile';

import AssetButton from './buttons/assetButton';
import NetworkButton from './buttons/networkButton';

import { WalletConnectService } from '../services/walletConnectService';
import { parseQrCodeData } from '../utils';
import { encodeEthereumUsdtTransfer } from '../types/tether';
import { Address } from '../types/ethereum';
import WalletButton from './buttons/walletButton';
import QRCodeStyling from '@solana/qr-code-styling';

export class Checkout extends HTMLElement {
  private shadow: ShadowRoot;
  private initOptions: InitOptions | null = null;

  private API: API | null = null;
  private sdkConfig: GetSDKConfigResponse | null = null;
  private cryptoTransaction: CreateTransactionResponse | null = null;
  private getCryptoTransactionIntervalID: NodeJS.Timeout | null = null;
  private lydianTransaction: CreateTransactionResponse | null = null;
  private getLydianTransactionIntervalID: NodeJS.Timeout | null = null;

  private walletConnectService: WalletConnectService | null = null;

  private containerPaymentSuccess: HTMLDivElement | null = null;
  private containerPaymentFailure: HTMLDivElement | null = null;
  private containerQRCode: HTMLDivElement | null = null;
  private lydianProcessingContainer: HTMLDivElement | null = null;
  private lydianProcessingText: HTMLParagraphElement | null = null;

  private lydianUsdtPaymentContainer: HTMLDivElement | null = null;
  private containerMoreNetworks: HTMLDivElement | null = null;
  private containerNetworks: HTMLDivElement | null = null;
  private containerNetworkList: HTMLDivElement | null = null;

  private assetImg: HTMLImageElement | null = null;
  private assetTitle: HTMLDivElement | null = null;

  private containerCryptoPayment: HTMLDivElement | null = null;
  private containerAssets: HTMLDivElement | null = null;
  private containerAssetsMore: HTMLDivElement | null = null;
  private btnMoreAssets: HTMLButtonElement | null = null;

  private canvasQRCode: HTMLDivElement | null = null;

  private displayTotalAmount: HTMLTableCellElement | null = null;
  private displayTransactionID: HTMLTableCellElement | null = null;
  private displayAssetTotal: HTMLTableCellElement | null = null;
  private displayScanText: HTMLSpanElement | null = null;
  private displayExpirationLeft: HTMLTableCellElement | null = null;

  private btnAppPayment: HTMLButtonElement | null = null;
  private btnCryptoPayment: HTMLButtonElement | null = null;
  private btnMoreNetworks: HTMLButtonElement | null = null;

  private btnCancelCryptoPayment: HTMLButtonElement | null = null;
  private lydianBtnCancelCryptoPayment: HTMLButtonElement | null = null;
  private lydianBtnCancelUsdtPayment: HTMLButtonElement | null = null;
  private lydianBtnCancelWalletConnect: HTMLButtonElement | null = null;

  private selectedAsset: Asset | null = null;
  private selectedAssetNetworks: string[] | null = null;
  private selectedNetwork: string | null = null;
  private selectedWallet: any;

  private connectWalletButtonsContainer: HTMLDivElement | null = null;
  private containerMoreWallets: HTMLDivElement | null = null;
  private containerWalletList: HTMLDivElement | null = null;
  private btnMoreWallets: HTMLButtonElement | null = null;
  private containerWalletManual: HTMLDivElement | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.walletConnectService = new WalletConnectService({ shadow: this.shadow });
  }

  public async getMerchantConfiguration(options: InitOptions) {

    this.initOptions = options;

    this.API = new API(options.sandbox ? BaseUrlSandbox : BaseUrlProduction, this.initOptions.publishableKey);
    await this.getSDKConfig();
    this.render();
    this.initializeComponents(); // TODO: update this section
    this.setAssetButtons();
    this.attachListeners();
    this.loadInitialState();

    await this.walletConnectService?.init();
  }

  public async updateTransaction(transaction: Transaction) {
    if (!this.initOptions) {
      throw new Error('Tether Pay not initialized.');
    }
    if (!transaction.amount || !transaction.currency) {
      throw new Error('Amount and currency are required.');
    }
    if (!isCurrency(transaction.currency)) {
      throw new Error('Invalid value for currency, valid values are: ' + currencies.join(', '));
    }
    this.initOptions.transaction = transaction;
    this.loadInitialState();
  }

  private loadInitialState(): void {
    this.setSelectedAsset(null);
    this.setSelectedNetwork(null);
    this.clearInterval();
    this.hideQRCode();
    this.hidePaymentSuccess();

    this.showButtons();

    this.btnAppPayment?.classList.add('hidden');
    if (this.sdkConfig?.appPayEnabled) {
      this.btnAppPayment?.classList.remove('hidden');
    }

    this.btnCryptoPayment?.classList.add('hidden');
    if (this.sdkConfig?.cryptoPayEnabled) {
      this.btnCryptoPayment?.classList.remove('hidden');
    }

    this.lydianUsdtPaymentContainer?.classList.add('hidden');

    // Pay with crypto container initial state
    this.containerCryptoPayment?.classList.add('hidden');
    this.containerAssetsMore?.classList.add('hidden');
    this.btnMoreAssets?.classList.remove('hidden');

    // Pay with USDT container initial state
    this.containerNetworks?.classList.add('hidden');
    this.containerMoreNetworks?.classList.add('hidden');
    this.btnMoreNetworks?.classList.remove('hidden');

    this.containerMoreWallets?.classList.add('hidden');
    this.btnMoreWallets?.classList.remove('hidden');

    this.connectWalletButtonsContainer?.classList.add('hidden');
  }

  private setSelectedAsset(code: string | null) {
    switch (code) {
      case AllowedAssetBitcoin:
        this.selectedAsset = AssetBitcoin;
        break;
      case AllowedAssetEthereum:
        this.selectedAsset = AssetEthereum;
        break;
      case AllowedAssetUSDT:
        this.selectedAsset = AssetUSDT;
        break;
      case AllowedAssetUSDC:
        this.selectedAsset = AssetUSDC;
        break;
      default:
        this.selectedAsset = null;
        break;
    }
  }

  private setSelectedNetwork(network: string | null) {
    this.selectedNetwork = network;
  }

  private setSelectedWallet(wallet: any) {
    this.selectedWallet = wallet;
  }

  private showPaymentSuccess(): void {
    this.containerPaymentSuccess?.classList.remove('hidden');
    this.hideButtons();
    this.hideQRCode();
  }

  private showPaymentFailure(): void {
    this.containerPaymentFailure?.classList.remove('hidden');
    this.hideButtons();
    this.hideQRCode();
  }

  private hidePaymentSuccess(): void {
    this.containerPaymentSuccess?.classList.add('hidden');
  }

  private showProcessing(message: string = 'Processing...'): void {
    if (this.lydianProcessingText) {
      this.lydianProcessingText.innerHTML = message;
    }
    this.lydianProcessingContainer?.classList.remove('hidden');
  }

  private hideProcessing(): void {
    if (this.lydianProcessingText) {
      this.lydianProcessingText.innerHTML = '';
    }
    this.lydianProcessingContainer?.classList.add('hidden');
  }

  private showButtons(): void {
    if (this.sdkConfig?.appPayEnabled) {
      this.btnAppPayment?.classList.remove('hidden');
    }
    if (this.sdkConfig?.cryptoPayEnabled) {
      this.btnCryptoPayment?.classList.remove('hidden');
    }
  }

  private hideButtons(): void {
    this.btnAppPayment?.classList.add('hidden');
    this.btnCryptoPayment?.classList.add('hidden');
    this.lydianUsdtPaymentContainer?.classList.add('hidden');
    this.containerCryptoPayment?.classList.add('hidden');
    this.containerNetworks?.classList.add('hidden');
    this.connectWalletButtonsContainer?.classList.add('hidden');
    this.containerWalletManual?.classList.add('hidden');
  }

  private showQRCode(qrData: string, amount: number): void {
    if (!this.selectedAsset) {
      return;
    }
    this.containerQRCode?.classList.remove('hidden');
    if (this.displayAssetTotal) {
      this.displayAssetTotal.innerText = amount + " " + this.selectedAsset.code.toUpperCase();
    }
    if (this.displayTransactionID) {
      this.displayTransactionID.innerText = <string>this.initOptions?.transaction.referenceNumber;
    }
    if (this.displayTotalAmount) {
      this.displayTotalAmount.innerText = <string>this.initOptions?.transaction.amount.toLocaleString('en-US', {
        style: 'currency',
        currency: this.initOptions?.transaction.currency
      })
    }

    if (this.displayExpirationLeft) {
      const clock = this.displayExpirationLeft;
      const expirationTime = new Date().getTime() + 15 * 60 * 1000;

      const timeInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = expirationTime - now;

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        clock.innerHTML = minutes + ":" + seconds;
        if (distance <= 0) {
          clearInterval(timeInterval)
        }
      }, 1000);

    }

    if (this.displayScanText && this.selectedWallet.code == 'manual') {
      this.displayScanText.innerHTML = 'Scan the code below using your <br />CAMERA, CRYPTO WALLET, or QR READER';
    }

    let centerImg = '';
    switch (this.selectedWallet.code) {
      case 'manual':
        // TODO: change this based on asset selected
        centerImg = 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/7065960c-8ebd-4d80-f352-8027ff2bb600/public';
        break;
      case 'metamask':
        centerImg = 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/a0ddd685-4a84-4f5c-ab6d-9796994cf500/public';
        break;
      case 'trustwallet':
        centerImg = 'https://imagedelivery.net/PC9Gitw-w-Qpo5uwdjlmgw/327c5e87-ea96-4b84-aa1f-8f99c2c70f00/public';
        break;
    }

    if (this.canvasQRCode) {
      const qrCode = new QRCodeStyling({
        width: 238,
        height: 238,
        type: 'canvas',
        data: qrData,
        image: centerImg,
        dotsOptions: {
          color: '#000000',
          type: 'extra-rounded'
        },
        backgroundOptions: {
          color: '#ffffff'
        }
      });

      qrCode.append(this.canvasQRCode);

    }
  }

  private hideQRCode(): void {
    this.containerQRCode?.classList.add('hidden');
    if (this.canvasQRCode) {
      this.canvasQRCode.innerHTML = '';
    }
  }

  private render(): void {
    this.shadow.innerHTML = `<style>${lydianCSS}</style>${checkoutTemplate}`;
  }

  private initializeComponents(): void {
    this.lydianUsdtPaymentContainer = this.shadowRoot?.getElementById('lydianUsdtPaymentContainer') as HTMLDivElement;
    this.containerMoreNetworks = this.shadowRoot?.getElementById('containerMoreNetworks') as HTMLDivElement;
    this.containerNetworks = this.shadowRoot?.getElementById('containerNetworks') as HTMLDivElement;
    this.containerNetworkList = this.shadowRoot?.getElementById('containerNetworkList') as HTMLDivElement;
    this.containerPaymentSuccess = this.shadowRoot?.getElementById('containerPaymentSuccess') as HTMLDivElement;
    this.containerPaymentFailure = this.shadowRoot?.getElementById('containerPaymentFailure') as HTMLDivElement;
    this.containerQRCode = this.shadowRoot?.getElementById('containerQRCode') as HTMLDivElement;
    this.lydianProcessingContainer = this.shadowRoot?.getElementById('lydianProcessingContainer') as HTMLDivElement;
    this.lydianProcessingText = this.shadowRoot?.getElementById('lydianProcessingText') as HTMLParagraphElement;


    this.assetImg = this.shadowRoot?.getElementById("assetImg") as HTMLImageElement;
    this.assetTitle = this.shadowRoot?.getElementById('assetTitle') as HTMLDivElement;

    this.containerCryptoPayment = this.shadowRoot?.getElementById('containerCryptoPayment') as HTMLDivElement;
    this.containerAssets = this.shadowRoot?.getElementById('containerAssets') as HTMLDivElement;
    this.containerAssetsMore = this.shadowRoot?.getElementById('containerAssetsMore') as HTMLDivElement;

    this.canvasQRCode = this.shadowRoot?.getElementById('canvasQRCode') as HTMLDivElement;

    this.displayTotalAmount = this.shadowRoot?.getElementById('displayTotalAmount') as HTMLTableCellElement;
    this.displayTransactionID = this.shadowRoot?.getElementById('displayTransactionID') as HTMLTableCellElement;
    this.displayAssetTotal = this.shadowRoot?.getElementById('displayAssetTotal') as HTMLTableCellElement;
    this.displayScanText = this.shadowRoot?.getElementById('displayScanText') as HTMLSpanElement;
    this.displayExpirationLeft = this.shadowRoot?.getElementById('displayExpirationLeft') as HTMLTableCellElement;

    this.btnAppPayment = this.shadowRoot?.getElementById('btnAppPayment') as HTMLButtonElement;
    this.btnCryptoPayment = this.shadowRoot?.getElementById('btnCryptoPayment') as HTMLButtonElement;
    this.btnMoreNetworks = this.shadowRoot?.getElementById('btnMoreNetworks') as HTMLButtonElement;
    this.btnMoreAssets = this.shadowRoot?.getElementById('btnMoreAssets') as HTMLButtonElement;
    this.btnMoreWallets = this.shadowRoot?.getElementById('btnMoreWallets') as HTMLButtonElement;

    this.btnCancelCryptoPayment = this.shadowRoot?.getElementById('btnCancelCryptoPayment') as HTMLButtonElement;
    this.lydianBtnCancelCryptoPayment = this.shadowRoot?.getElementById('lydianBtnCancelCryptoPayment') as HTMLButtonElement;
    this.lydianBtnCancelUsdtPayment = this.shadowRoot?.getElementById('lydianBtnCancelUsdtPayment') as HTMLButtonElement;
    this.lydianBtnCancelWalletConnect = this.shadowRoot?.getElementById('lydianBtnCancelWalletConnect') as HTMLButtonElement;

    this.connectWalletButtonsContainer = this.shadowRoot?.getElementById('connectWalletContainer') as HTMLDivElement;
    this.containerMoreWallets = this.shadowRoot?.getElementById('containerMoreWallets') as HTMLDivElement;
    this.containerWalletList = this.shadowRoot?.getElementById('containerWalletList') as HTMLDivElement;
    this.containerWalletManual = this.shadowRoot?.getElementById('containerWalletManual') as HTMLDivElement;
  }

  private attachListeners(): void {
    this.btnAppPayment?.addEventListener('click', (e) => {
      console.log('TODO: NOT IMPLEMENTED');
    });

    this.btnCryptoPayment?.addEventListener('click', () => {
      this.btnCryptoPayment?.classList.toggle('hidden');
      this.containerCryptoPayment?.classList.toggle('hidden');
    });

    this.btnMoreNetworks?.addEventListener('click', () => {
      this.containerMoreNetworks?.classList.toggle('hidden');
      this.btnMoreNetworks?.classList.toggle('hidden');
    });

    this.btnMoreAssets?.addEventListener('click', () => {
      this.containerAssetsMore?.classList.toggle('hidden');
      this.btnMoreAssets?.classList.toggle('hidden');
    });

    this.btnMoreWallets?.addEventListener('click', () => {
      this.containerMoreWallets?.classList.toggle('hidden');
      this.btnMoreWallets?.classList.toggle('hidden');
    });

    this.btnCancelCryptoPayment?.addEventListener('click', () => {
      this.loadInitialState();
    });
    this.lydianBtnCancelCryptoPayment?.addEventListener('click', () => {
      this.loadInitialState();
    });
  }

  private async createCryptoTransaction() {
    if (!this.selectedAsset || !this.selectedNetwork) {
      this.initOptions?.paymentFailedListener?.('Asset and network selection required.');
      return;
    }

    if (this.initOptions && this.API) {
      this.clearInterval();
      this.hideButtons();
      try {
        this.cryptoTransaction = await this.API.createCryptoTransaction({
          descriptor: this.initOptions.transaction.descriptor,
          referenceNumber: this.initOptions.transaction.referenceNumber,
          amount: this.initOptions.transaction.amount,
          amountCurrency: this.initOptions.transaction.currency,
          asset: this.selectedAsset.code,
          network: this.selectedNetwork,
        });
        console.log('transaction', this.cryptoTransaction);
      } catch (error) {
        this.initOptions?.paymentFailedListener?.('Unable to create transaction.');
      }

    } else {
      this.initOptions?.paymentFailedListener?.('Lydian not initialized.');
    }
  }

  private startListeningCryptoTransaction() {
    this.clearInterval();
    this.getCryptoTransactionIntervalID = setInterval(async () => {
      if (this.cryptoTransaction?.transactionId) {
        const transaction = await this.API?.getCryptoTransaction(this.cryptoTransaction?.transactionId);
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
            this.initOptions?.paymentFailedListener?.('Transaction Timed Out / Failed!');
          }
        }
      }
    }, 2000);
  }

  private startListeningLydianTransaction() {
    this.clearInterval();
    this.getLydianTransactionIntervalID = setInterval(async () => {
      if (this.lydianTransaction?.transactionId) {
        const transaction = await this.API?.getClusterTransaction(this.lydianTransaction?.transactionId);
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
            this.initOptions?.paymentFailedListener?.('Transaction Timed Out / Failed!');
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
    if (this.getLydianTransactionIntervalID) {
      clearInterval(this.getLydianTransactionIntervalID);
      this.getLydianTransactionIntervalID = null;
    }
  }

  private setAssetButtons() {
    if (!this.containerAssets || !this.containerAssetsMore) {
      return;
    }

    this.containerAssets.innerHTML = '';
    this.containerAssetsMore.innerHTML = '';

    const buttons = this.sdkConfig?.allowedAssets?.map((asset, index) => {
      switch (asset.code) {
        case AllowedAssetBitcoin:
          return AssetButton(AssetBitcoin);
        case AllowedAssetEthereum:
          return AssetButton(AssetEthereum);
        case AllowedAssetUSDT:
          return AssetButton(AssetUSDT);
        case AllowedAssetUSDC:
          return AssetButton(AssetUSDC);
      }
    });

    buttons?.filter(v => v).forEach((button, index) => {
      if (index >= 2 && this.containerAssetsMore) {
        this.containerAssetsMore.innerHTML += button;
      } else if (this.containerAssets) {
        this.containerAssets.innerHTML += button;
      }
    })

    if (this.sdkConfig?.allowedAssets && this.sdkConfig.allowedAssets.length <= 2) {
      this.btnMoreAssets?.classList.add('hidden');
    }


    this.attachListenersOnAssets();
  }

  private attachListenersOnAssets() {
    this.sdkConfig?.allowedAssets?.forEach((asset) => {
      const assetBtn = this.shadowRoot?.getElementById('btnAsset' + asset.code) as HTMLButtonElement;
      assetBtn?.addEventListener('click', async () => {
        this.setSelectedAsset(asset.code)

        this.containerCryptoPayment?.classList.add('hidden');

        if (asset.type == 'token') {
          this.setNetworkButtons();
        } else {
          this.setSelectedNetwork(asset.networks[0])
          this.showWalletConnectButtons();
        }
      });
    });
  }

  private setNetworkButtons() {
    if (!this.containerNetworkList || !this.containerMoreNetworks || !this.assetImg || !this.assetTitle) {
      return;
    }
    this.containerNetworkList.innerHTML = '';
    this.containerMoreNetworks.innerHTML = '';

    this.assetTitle.innerHTML = <string>this.selectedAsset?.title;
    this.assetImg.src = <string>this.selectedAsset?.img;

    const asset = this.sdkConfig?.allowedAssets.find(a => a.code === this.selectedAsset?.code);
    if (asset == undefined) {
      console.log("Unknown asset: ", this.selectedAsset?.code);
      return;
    }
    console.log('asset', asset);

    asset?.networks.forEach((chain, index) => {
      let button;
      switch (chain) {
        case AllowedNetworkBitcoin:
          button = NetworkButton(NetworkBitcoin)
          break;
        case AllowedNetworkEthereum:
          button = NetworkButton(NetworkEthereum);
          break;

        case AllowedNetworkTron:
          button = NetworkButton(NetworkTron);
          break;

        case AllowedNetworkSolana:
          button = NetworkButton(NetworkSolana);
          break;

        case AllowedNetworkTon:
          button = NetworkButton(NetworkTon);
          break;

        case AllowedNetworkAvalanche:
          button = NetworkButton(NetworkAvalanche);
          break;

        case AllowedNetworkAptos:
          button = NetworkButton(NetworkAptos);
          break;
      }
      if (index >= 4 && this.containerMoreNetworks) {
        this.containerMoreNetworks.innerHTML += button;
      } else if (this.containerNetworkList) {
        this.containerNetworkList.innerHTML += button;
      }
    });

    if (asset?.networks && asset?.networks.length <= 2) {
      this.btnMoreNetworks?.classList.add('hidden');
    }

    this.containerNetworks?.classList.remove('hidden');

    this.attachListenerOnNetworks(asset.networks);
  }

  private attachListenerOnNetworks(networks: string[]) {
    networks?.forEach((networkCode) => {
      const networkBtn = this.shadowRoot?.getElementById('btnNetwork' + networkCode) as HTMLButtonElement;
      networkBtn?.addEventListener('click', async () => {
        this.setSelectedNetwork(networkCode);
        this.showWalletConnectButtons();
      });
    });

    this.lydianBtnCancelUsdtPayment?.addEventListener('click', async () => {
      this.loadInitialState();
    });
  }

  private async getSDKConfig() {
    if (this.API) {
      try {
        this.sdkConfig = await this.API.getSDKConfig();
        // TODO: update this after backend updated
        this.API.setClusterBaseUri(this.sdkConfig.tetherPayCluster);
      } catch (error) {
        this.initOptions?.paymentFailedListener?.('Unable to load SDK configuration.');
      }
    } else {
      this.initOptions?.paymentFailedListener?.('SDK not initialized.');
    }
  }

  private async showWalletConnectButtons() {
    if (!this.connectWalletButtonsContainer || !this.containerMoreWallets || !this.containerWalletList) {
      return;
    }

    this.containerWalletList.innerHTML = '';
    this.containerMoreWallets.innerHTML = '';

    this.containerNetworks?.classList.add('hidden');

    this.connectWalletButtonsContainer.classList.remove('hidden');

    const manualQrButton = {
      id: 'manual',
      name: 'Manual QR Code',
      img: 'https://tetherpay.com/images/95de9fd2-da4f-4415-3ec7-bb1befdbc500/public'
    }

    if (this.containerWalletManual) {
      this.containerWalletManual.innerHTML = '';
      this.containerWalletManual.innerHTML += WalletButton(manualQrButton);
    }

    // TODO: extract this to constants
    const wallets: WalletConnectWallet[] = [
      {
        id: 'metamask',
        name: 'MetaMask',
        img: 'https://tetherpay.com/images/a0ddd685-4a84-4f5c-ab6d-9796994cf500/public',
        wcPeerName: 'MetaMask Wallet'
      },
      {
        id: 'trustwallet',
        name: 'Trust Wallet',
        img: 'https://logowik.com/content/uploads/images/trust-wallet-shield4830.logowik.com.webp',
        wcPeerName: 'Trust Wallet'
      },
    ];

    wallets.forEach((wallet, index) => {
      const button = WalletButton(wallet, !!this.walletConnectService?.findSession(wallet));
      if (index >= 3 && this.containerMoreWallets) {
        this.containerMoreWallets.innerHTML += button;
      } else if (this.containerWalletList) {
        this.containerWalletList.innerHTML += button;
      }
    });

    if (wallets.length <= 3) {
      this.containerMoreWallets?.classList.add('hidden');
    }

    this.containerWalletList?.classList.remove('hidden');

    this.attachListenerOnWallets([...wallets, manualQrButton]);
  }

  private attachListenerOnWallets(wallets: WalletConnectWallet[]) {
    wallets.forEach((wallet) => {
      const walletBtn = this.shadowRoot?.getElementById('btnWallet' + wallet.id) as HTMLButtonElement;
      walletBtn?.addEventListener('click', async () => {
        this.setSelectedWallet(wallet);
        this.beginWalletConnectTransaction()
      });
    });
    
    this.lydianBtnCancelWalletConnect?.addEventListener('click', async () => {
      this.loadInitialState();
    });
  }

  private async beginWalletConnectTransaction() {
    if (!this.selectedAsset || !this.selectedNetwork) {
      this.initOptions?.paymentFailedListener?.('Asset and network selection required.');
      return;
    }
    if (!this.initOptions || !this.API) {
      this.initOptions?.paymentFailedListener?.('Lydian not initialized.');
      return;
    }
    if (!this.walletConnectService) {
      this.initOptions?.paymentFailedListener?.('Wallet Connect not initialized.');
      return;
    }

    this.connectWalletButtonsContainer?.classList.add('hidden');

    try {
      this.cryptoTransaction = await this.API.createCryptoTransaction({
        descriptor: this.initOptions.transaction.descriptor,
        referenceNumber: this.initOptions.transaction.referenceNumber,
        amount: this.initOptions.transaction.amount,
        amountCurrency: this.initOptions.transaction.currency,
        asset: this.selectedAsset.code,
        network: this.selectedNetwork,
      });
      console.log('transaction', this.cryptoTransaction);

      if (this.selectedWallet.id == 'manual') {
        this.showQRCode(this.cryptoTransaction.qrData, this.cryptoTransaction.assetAmount);
      } else {

        let walletSession = this.walletConnectService?.findSession(this.selectedWallet);

        console.log('selected wallet', this.selectedWallet);
        console.log('matching wallet session', walletSession);

        // Display QR for session connection
        if (!walletSession) {
          const { uri, approval } = await this.walletConnectService?.connectWalletWithQrCode();

          if (uri) {
            this.showQRCode(uri, this.cryptoTransaction.assetAmount);
          }

          walletSession = await approval();

          console.log("Session established:", walletSession);
          this.walletConnectService.currentSession = walletSession;
          this.hideQRCode();
        }


        const fromAddress = this.walletConnectService.getSessionAddress(walletSession, 'eip155:1');
        if (!fromAddress) {
          throw new Error('failed to find wallet address from current session');
        }

        const params = parseQrCodeData(this.cryptoTransaction.qrData);
        const usdtTransfer = encodeEthereumUsdtTransfer({
          fromAddress: fromAddress as Address,
          toAddress: params.address,
          uint256: parseInt(params.uint256)
        });

        try {
          this.showProcessing(`Waiting for transaction approval from ${walletSession.peer.metadata.name}...`)
          const transferResp = await this.walletConnectService.sendEthTransaction(usdtTransfer, walletSession);
          // TODO: do something with this response?

          this.hideProcessing();
          this.showPaymentSuccess();
          this.clearInterval();
        } catch (error) {
          this.hideProcessing();
          this.showPaymentFailure();
          this.clearInterval();
        }
      } // End if/else from manual
      this.startListeningCryptoTransaction();
      if (isMobile()) {
        window.location.href = this.cryptoTransaction.qrData;
      }
    } catch (error) {
      this.initOptions?.paymentFailedListener?.('Unable to create cryptotransaction.');
    }
  }
}
