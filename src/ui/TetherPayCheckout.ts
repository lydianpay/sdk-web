import tetherPayCSS from './tetherpay.generated.css?inline';
import checkoutTemplate from './checkout-template.html?raw';
import {
  CreateTransactionResponse,
  Transaction,
  currencies,
  GetSDKConfigResponse,
  isCurrency,
  InitOptions,
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
  NetworkAptos,
  NetworkAvalanche,
  NetworkEthereum,
  NetworkSolana,
  NetworkTon,
  NetworkTron,
  CryptoTransactionStatusSuccess,
  QRCodeDefaults,
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

export class TetherPayCheckout extends HTMLElement {
  private shadow: ShadowRoot;
  private initOptions: InitOptions | null = null;

  private sdkConfig: GetSDKConfigResponse | null = null;
  private cryptoTransaction: CreateTransactionResponse | null = null;
  private API: API | null = null;
  private getCryptoTransactionIntervalID: NodeJS.Timeout | null = null;

  private walletConnectService: WalletConnectService | null = null;

  private containerPaymentSuccess: HTMLDivElement | null = null;
  private containerPaymentFailure: HTMLDivElement | null = null;
  private containerQRCode: HTMLDivElement | null = null;

  private tetherPayUsdtPaymentContainer: HTMLDivElement | null = null;
  private containerMoreNetworks: HTMLDivElement | null = null;
  private containerNetworks: HTMLDivElement | null = null;
  private containerNetworkList: HTMLDivElement | null = null;

  private assetImg: HTMLImageElement | null = null;
  private assetTitle: HTMLDivElement | null = null;

  private containerCryptoPayment: HTMLDivElement | null = null;
  private containerAssets: HTMLDivElement | null = null;
  private containerAssetsMore: HTMLDivElement | null = null;
  private btnMoreAssets: HTMLButtonElement | null = null;
  private tetherPayBtnCancelCryptoPayment: HTMLButtonElement | null = null;


  private canvasQRCode: HTMLCanvasElement | null = null;

  private qrCodeAmount: HTMLParagraphElement | null = null;

  private btnAppPayment: HTMLButtonElement | null = null;
  private btnCryptoPayment: HTMLButtonElement | null = null;
  private btnMoreNetworks: HTMLButtonElement | null = null;

  private tetherPayBtnCancelUsdtPayment: HTMLButtonElement | null = null;

  private selectedAsset: Asset | null = null;
  private selectedAssetNetworks: string[] | null = null;
  private selectedNetwork: string | null = null;

  private connectWalletButtonsContainer: HTMLDivElement | null = null;

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
    console.log("here")
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

    this.tetherPayUsdtPaymentContainer?.classList.add('hidden');

    // Pay with crypto container initial state
    this.containerCryptoPayment?.classList.add('hidden');
    this.containerAssetsMore?.classList.add('hidden');
    this.btnMoreAssets?.classList.remove('hidden');

    // Pay with USDT container initial state
    this.containerMoreNetworks?.classList.add('hidden');
    this.btnMoreNetworks?.classList.remove('hidden');
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
    this.tetherPayUsdtPaymentContainer?.classList.add('hidden');
    this.containerCryptoPayment?.classList.add('hidden');
    this.containerNetworks?.classList.add('hidden');
  }

  private showQRCode(qrData: string, amount: number): void {
    if (!this.selectedAsset) {
      return;
    }
    this.containerQRCode?.classList.remove('hidden');
    if (this.qrCodeAmount) {
      this.qrCodeAmount.innerText = amount + " " + this.selectedAsset.code.toUpperCase();
    }
    if (this.canvasQRCode) {
      if (this.canvasQRCode?.parentElement) {
        let qrCodeWidth = this.canvasQRCode.parentElement.clientWidth;
        const computedStyle = window.getComputedStyle(this.canvasQRCode.parentElement, null);
        qrCodeWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        QRCodeDefaults.width = qrCodeWidth;
      }
      QrCode.toDataURL(this.canvasQRCode, qrData, QRCodeDefaults);
    }
  }

  private hideQRCode(): void {
    this.containerQRCode?.classList.add('hidden');
    if (this.canvasQRCode) {
      const ctx = this.canvasQRCode.getContext('2d');
      ctx?.clearRect(0, 0, this.canvasQRCode.width, this.canvasQRCode.height);
    }
  }

  private render(): void {
    this.shadow.innerHTML = `<style>${tetherPayCSS}</style>${checkoutTemplate}`;
  }

  private initializeComponents(): void {
    this.tetherPayUsdtPaymentContainer = this.shadowRoot?.getElementById('tetherPayUsdtPaymentContainer') as HTMLDivElement;
    this.containerMoreNetworks = this.shadowRoot?.getElementById('containerMoreNetworks') as HTMLDivElement;
    this.containerNetworks = this.shadowRoot?.getElementById('containerNetworks') as HTMLDivElement;
    this.containerNetworkList = this.shadowRoot?.getElementById('containerNetworkList') as HTMLDivElement;
    this.containerPaymentSuccess = this.shadowRoot?.getElementById('containerPaymentSuccess') as HTMLDivElement;
    this.containerPaymentFailure = this.shadowRoot?.getElementById('containerPaymentFailure') as HTMLDivElement;
    this.containerQRCode = this.shadowRoot?.getElementById('containerQRCode') as HTMLDivElement;


    this.assetImg = this.shadowRoot?.getElementById("assetImg") as HTMLImageElement;
    this.assetTitle = this.shadowRoot?.getElementById('assetTitle') as HTMLDivElement;

    this.containerCryptoPayment = this.shadowRoot?.getElementById('containerCryptoPayment') as HTMLDivElement;
    this.containerAssets = this.shadowRoot?.getElementById('containerAssets') as HTMLDivElement;
    this.containerAssetsMore = this.shadowRoot?.getElementById('containerAssetsMore') as HTMLDivElement;

    this.canvasQRCode = this.shadowRoot?.getElementById('canvasQRCode') as HTMLCanvasElement;
    this.qrCodeAmount = this.shadowRoot?.getElementById('qrCodeAmount') as HTMLParagraphElement;

    this.btnAppPayment = this.shadowRoot?.getElementById('btnAppPayment') as HTMLButtonElement;
    this.btnCryptoPayment = this.shadowRoot?.getElementById('btnCryptoPayment') as HTMLButtonElement;
    this.btnMoreNetworks = this.shadowRoot?.getElementById('btnMoreNetworks') as HTMLButtonElement;
    this.tetherPayBtnCancelCryptoPayment = this.shadowRoot?.getElementById('tetherPayBtnCancelCryptoPayment') as HTMLButtonElement;
    this.btnMoreAssets = this.shadowRoot?.getElementById('btnMoreAssets') as HTMLButtonElement;

    this.connectWalletButtonsContainer = this.shadowRoot?.getElementById('connectWalletContainer') as HTMLDivElement;
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

    this.tetherPayBtnCancelCryptoPayment?.addEventListener('click', () => {
      this.loadInitialState();
    });
  }

  private async createCryptoTransaction() {
    if (!this.selectedAsset || !this.selectedNetwork) {
      this.initOptions?.paymentFailedListener?.('Asset and network selection required.');
      return;
    }

    // this.initMeshLink();

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

        // This shows the qrCode generated by fence to initiate the transfer
        // this.showQRCode(this.cryptoTransaction.qrData, this.cryptoTransaction.assetAmount);

        // This section will use wallet connect to initiate the transfer
        if (this.walletConnectService?.currentSession) {
          console.log('current session', this.walletConnectService.currentSession);

          if (!this.walletConnectService.currentSession) {
            const { uri, approval } = await this.walletConnectService.connectWalletWithQrCode();

            if (uri) {
              this.showQRCode(uri, this.cryptoTransaction.assetAmount);
            }

            // TODO: what happens here if the request is rejected?
            const session = await approval();

            console.log("Session established:", session);
            this.walletConnectService.currentSession = session;
            this.hideQRCode();
          }

          // TODO: update this to pick the correct address if multiple options
          // this.walletConnectService.getWalletAddress("ETH")
          // OR
          // this.walletConnectService.getSelectedAddress();
          const fromAddress = this.walletConnectService.currentSession.namespaces.eip155.accounts[0].split(':').pop();
          if (!fromAddress) {
            throw new Error('failed to find wallet address from current session');
          }

          const params = parseQrCodeData(this.cryptoTransaction.qrData);
          const usdtTransfer = encodeEthereumUsdtTransfer({
            fromAddress: fromAddress as Address,
            toAddress: params.address,
            uint256: parseInt(params.uint256)
          })

          const transferResp = await this.walletConnectService.sendEthTransaction(usdtTransfer);
          // TODO: do something with this response
        }

        this.startListeningCryptoTransaction();
        if (isMobile()) {
          window.location.href = this.cryptoTransaction.qrData;
        }
      } catch (error) {
        this.initOptions?.paymentFailedListener?.('Unable to create cryptotransaction.');
      }
    } else {
      this.initOptions?.paymentFailedListener?.('Tether Pay not initialized.');
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

  private clearInterval() {
    if (this.getCryptoTransactionIntervalID) {
      clearInterval(this.getCryptoTransactionIntervalID);
      this.getCryptoTransactionIntervalID = null;
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
          await this.createCryptoTransaction();
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
        this.setSelectedNetwork(networkCode)
        await this.createCryptoTransaction();
      });
    });

    this.tetherPayBtnCancelUsdtPayment?.addEventListener('click', async () => {
      this.loadInitialState();
    });
  }

  private async getSDKConfig() {
    if (this.API) {
      try {
        this.sdkConfig = await this.API.getSDKConfig();
        this.API.setClusterBaseUri(this.sdkConfig.tetherPayCluster);
      } catch (error) {
        this.initOptions?.paymentFailedListener?.('Unable to load SDK configuration.');
      }
    } else {
      this.initOptions?.paymentFailedListener?.('SDK not initialized.');
    }
  }

  // NOTE: likely will not use and will remove after Wallet Connect integration is flushed out
  // private async initWalletButtons(txn?: CreateTransactionResponse) {
  //   if (!this.connectWalletButtonsContainer) {
  //     return;
  //   }

  //   listProviders(this.connectWalletButtonsContainer, txn);
  // }

  // private async initMeshLink() {
  //   console.log('meshLink initializing');
  //   const meshLink = createLink({
  //     clientId: '64979f80-625c-4dd9-0017-08dcfdc5c8d3',
  //     onIntegrationConnected: (payload) => { 
  //       console.log('meshLink connected');
  //     },
  //     onExit: (error) => {
  //       console.log('meshLink exited', error);
  //     },
  //     onTransferFinished: (transferData) => { },
  //     onEvent: (ev) => { 
  //       console.log('meshLink event:', ev);
  //     },
  //     accessTokens: [],
  //     transferDestinationTokens: []
  //   });

  //   if (!this.API) {
  //     console.log('api not initialized')
  //     return;
  //   }

  //   const linkToken = await this.API.createLinkToken({userId: '123'});

  //   // TODO: fix issues
  //   // - Refused to frame 'https://web.meshconnect.com/' because an ancestor violates the
  //   //   following Content Security Policy directive: "frame-ancestors 'self' *.getfront.com 
  //   //   *.meshconnect.com getfront.com meshconnect.com".
  //   //
  //   //   https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
  //   meshLink.openLink(
  //     linkToken,
  //     'meshConnectFrame'
  //   );
  // }
}
