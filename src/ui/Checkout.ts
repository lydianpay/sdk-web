import lydianCSS from './lydian.generated.css?inline';
import checkoutTemplate from './checkout-template.html?raw';
import {
  Asset,
  CreateTransactionResponse,
  CryptoTransaction,
  currencies,
  GetSDKConfigResponse,
  InitOptions,
  isCurrency,
  Transaction,
  WalletConnectWallet,
} from '../types';
import {
  AllowedAssetArbitrum,
  AllowedAssetBase,
  AllowedAssetBitcoin,
  AllowedAssetCelo,
  AllowedAssetDai,
  AllowedAssetEthereum,
  AllowedAssetLinea,
  AllowedAssetOPMainnet,
  AllowedAssetPolygon,
  AllowedAssetPYUSD,
  AllowedAssetRLUSD,
  AllowedAssetSolana,
  AllowedAssetSonic,
  AllowedAssetUnichain,
  AllowedAssetUSDC,
  AllowedAssetUSDe,
  AllowedAssetUSDP,
  AllowedAssetUSDS,
  AllowedAssetUSDT,
  AllowedAssetZKsync,
  AllowedNetworkAptos,
  AllowedNetworkArbitrum,
  AllowedNetworkAvalanche,
  AllowedNetworkBase,
  AllowedNetworkBitcoin,
  AllowedNetworkCelo,
  AllowedNetworkEos,
  AllowedNetworkEthereum,
  AllowedNetworkHedara,
  AllowedNetworkKaia,
  AllowedNetworkLinea,
  AllowedNetworkNear,
  AllowedNetworkOPMainnet,
  AllowedNetworkPolygon,
  AllowedNetworkSolana,
  AllowedNetworkSonic,
  AllowedNetworkSui,
  AllowedNetworkTezos,
  AllowedNetworkTon,
  AllowedNetworkTron,
  AllowedNetworkUnichain,
  AllowedNetworkUniswap,
  AllowedNetworkZKsync,
  AssetArbitrum,
  AssetBase,
  AssetBitcoin,
  AssetCelo,
  AssetDAI,
  AssetEthereum,
  AssetLinea,
  AssetOPMainnet,
  AssetPolygon,
  AssetPYUSD,
  AssetRLUSD,
  AssetSolana,
  AssetSonic,
  AssetUnichain,
  AssetUSDC,
  AssetUSDe,
  AssetUSDP,
  AssetUSDS,
  AssetUSDT,
  AssetZKsync,
  BaseUrlDev,
  BaseUrlProduction,
  BaseUrlSandbox,
  CryptoTransactionStatusPending,
  CryptoTransactionStatusPendingKYCVerification,
  CryptoTransactionStatusSuccess,
  NetworkAptos,
  NetworkArbitrum,
  NetworkAvalanche,
  NetworkBase,
  NetworkBitcoin,
  NetworkCelo,
  NetworkEos,
  NetworkEthereum,
  NetworkHedara,
  NetworkKaia,
  NetworkLinea,
  NetworkNear,
  NetworkOPMainnet,
  NetworkPolygon,
  NetworkSolana,
  NetworkSonic,
  NetworkSui,
  NetworkTezos,
  NetworkTon,
  NetworkTron,
  NetworkUnichain,
  NetworkUniswap,
  NetworkZKsync,
} from '../constants';
import { API } from '../network';
import isMobile from 'is-mobile';

import AssetButton from './buttons/assetButton';
import NetworkButton from './buttons/networkButton';

import { WalletConnectService } from '../services/walletConnectService';
import {
  capitalizeFirstLetter,
  convertAmountToUSDT,
  convertCryptoToUSDT,
  formatCurrency,
  formatDateForTransactionDetails,
  parseQrCodeData,
} from '../utils';
import { encodeEthereumUsdtTransfer } from '../types/tether';
import { Address } from '../types/ethereum';
import WalletButton from './buttons/walletButton';
import QRCodeStyling from '@solana/qr-code-styling';
import { encodeEthereumUsdcTransfer, USDC_ERC20_MAIN } from '../types/usdc';

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
  private displayAdditionalCustomerFee: HTMLTableCellElement | null = null;
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

  private modal: HTMLDialogElement | null = null;
  private modalBtnBack: HTMLButtonElement | null = null;

  private modalContainerPaymentSuccess: HTMLDivElement | null = null;
  private modalContainerPaymentFailure: HTMLDivElement | null = null;
  private modalContainerQRCode: HTMLDivElement | null = null;
  private modalLydianProcessingContainer: HTMLDivElement | null = null;
  private modalLydianProcessingText: HTMLParagraphElement | null = null;

  private modalContainerMoreNetworks: HTMLDivElement | null = null;
  private modalContainerNetworks: HTMLDivElement | null = null;
  private modalContainerNetworkList: HTMLDivElement | null = null;
  private modalBtnMoreNetworks: HTMLButtonElement | null = null;

  private modalAssetImg: HTMLImageElement | null = null;
  private modalAssetTitle: HTMLDivElement | null = null;

  private modalContainerCryptoPayment: HTMLDivElement | null = null;
  private modalContainerAssets: HTMLDivElement | null = null;

  private modalCanvasQRCode: HTMLDivElement | null = null;

  // private modalDisplayTotalAmount: HTMLTableCellElement | null = null;
  // private modalDisplayTransactionID: HTMLTableCellElement | null = null;
  // private modalDisplayTransactionID: HTMLTableCellElement | null = null;
  // private modalDisplayAssetTotal: HTMLTableCellElement | null = null;
  private modalDisplayAssetTotal: HTMLParagraphElement | null = null;
  private modalDisplayScanText: HTMLSpanElement | null = null;
  // private modalDisplayExpirationLeft: HTMLTableCellElement | null = null;
  private modalDisplayExpirationLeft: HTMLSpanElement | null = null;

  private modalTitle: HTMLDivElement | null = null;

  private modalDisplayNetwork: HTMLSpanElement | null = null;
  private modalDisplayWalletAddress: HTMLParagraphElement | null = null;
  private modalButtonCopyAssetTotal: HTMLButtonElement | null = null;
  private modalButtonCopyWalletAddress: HTMLButtonElement | null = null;

  private modalTransactionOverpaidAmountUSDTContainer: HTMLDivElement | null = null;
  private modalTransactionReturnAmountUSDTContainer: HTMLDivElement | null = null;
  private modalLydianID: HTMLSpanElement | null = null;
  private modalTransactionAmount: HTMLSpanElement | null = null;
  private modalTransactionAmountUSDT: HTMLSpanElement | null = null;
  private modalTransactionTotalAmountUSDT: HTMLSpanElement | null = null;
  private modalTransactionOverpaidAmountUSDT: HTMLSpanElement | null = null;
  private modalTransactionReturnAmountUSDT: HTMLSpanElement | null = null;
  private modalOverpaidWarning: HTMLDivElement | null = null;
  private modalOverpaidLessThanGasFeesWarning: HTMLDivElement | null = null;

  private modalUnderpaidWarning: HTMLDivElement | null = null;
  private modalUnderpaidAmountsBlock: HTMLDivElement | null = null;
  private modalTransactionAmountForUnderpaidWarning: HTMLSpanElement | null = null;
  private modalTransactionAmountForUnderpaid: HTMLSpanElement | null = null;
  private modalTransactionPaidAmountForUnderpaid: HTMLSpanElement | null = null;
  private modalTransactionDetailsContainer: HTMLDivElement | null = null;
  private modalTransactionDetailItemsContainer: HTMLDivElement | null = null;
  private modalButtonTransactionDetails: HTMLButtonElement | null = null;

  private modalUnderpaidButtonsContainer: HTMLDivElement | null = null;
  private modalButtonCancelTransaction: HTMLButtonElement | null = null;
  private modalButtonChooseDifferentAsset: HTMLButtonElement | null = null;

  private modalCancelTransaction: HTMLDialogElement | null = null;
  private modalButtonRejectCancelTransaction: HTMLButtonElement | null = null;
  private modalButtonAcceptCancelTransaction: HTMLButtonElement | null = null;

  private modalHeaderButtonNeedHelp: HTMLAnchorElement | null = null;
  private modalTransactionCompleteButtonNeedHelp: HTMLAnchorElement | null = null;
  private modalOverpaidButtonNeedHelp: HTMLAnchorElement | null = null;
  private modalUnderpaidButtonNeedHelp: HTMLAnchorElement | null = null;

  private modalCloseTransactionModal: HTMLDialogElement | null = null;
  private modalButtonAcceptTransactionModalClose: HTMLButtonElement | null = null;
  private modalButtonRejectTransactionModalClose: HTMLButtonElement | null = null;
  private modalCloseTransactionModalDescription: HTMLParagraphElement | null = null;

  // KYC & Travel Rules (Modal UI)
  private modalContainerKYCAndTravelRulesContainer: HTMLDivElement | null = null;
  private modalEmail: HTMLInputElement | null = null;
  private modalFirstName: HTMLInputElement | null = null;
  private modalLastName: HTMLInputElement | null = null;
  private modalStreet: HTMLInputElement | null = null;
  private modalCity: HTMLInputElement | null = null;
  private modalRegion: HTMLInputElement | null = null;
  private modalPostalCode: HTMLInputElement | null = null;
  private modalCountry: HTMLSelectElement | null = null;
  private modalDocumentType: HTMLSelectElement | null = null;
  private modalDocumentFileFront: HTMLInputElement | null = null;
  private modalDocumentFileBackContainer: HTMLDivElement | null = null;
  private modalDocumentFileBack: HTMLInputElement | null = null;
  private modelButtonKYCVerificationAndTravelRules: HTMLButtonElement | null = null;

  // KYC & Travel Rules (Embedded UI)
  private containerKYCAndTravelRules: HTMLDivElement | null = null;
  private email: HTMLInputElement | null = null;
  private firstName: HTMLInputElement | null = null;
  private lastName: HTMLInputElement | null = null;
  private street: HTMLInputElement | null = null;
  private city: HTMLInputElement | null = null;
  private region: HTMLInputElement | null = null;
  private postalCode: HTMLInputElement | null = null;
  private country: HTMLSelectElement | null = null;
  private documentType: HTMLSelectElement | null = null;
  private documentFileFront: HTMLInputElement | null = null;
  private documentFileBackContainer: HTMLDivElement | null = null;
  private documentFileBack: HTMLInputElement | null = null;
  private buttonKYCVerificationAndTravelRules: HTMLButtonElement | null = null;

  private processingUnderpayment: boolean = false;

  private timeInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.walletConnectService = new WalletConnectService({ shadow: this.shadow });
  }

  public async getMerchantConfiguration(options: InitOptions) {

    this.initOptions = options;

    // Default to Sandbox
    let baseURI = BaseUrlSandbox;
    if (options.dev) {
      baseURI = BaseUrlDev;
    }
    if (!options.dev && !options.sandbox) {
      baseURI = BaseUrlProduction;
    }

    this.API = new API(baseURI, this.initOptions.publishableKey);
    this.render();
    await this.getSDKConfig();
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

    this.containerPaymentFailure?.classList.add('hidden');
    this.modalContainerPaymentFailure?.classList.add('hidden');
    this.containerPaymentSuccess?.classList.add('hidden');
    this.modalContainerPaymentSuccess?.classList.add('hidden');

    this.btnAppPayment?.classList.add('hidden');
    if (this.sdkConfig?.appPayEnabled) {
      this.btnAppPayment?.classList.remove('hidden');
    }

    this.btnCryptoPayment?.classList.add('hidden');
    if (this.sdkConfig?.cryptoPayEnabled) {
      this.btnCryptoPayment?.classList.remove('hidden');
    }

    this.modalButtonCancelTransaction?.classList.add('hidden');
    if (this.sdkConfig?.cancelTransactionEnabled) {
      this.modalButtonCancelTransaction?.classList.remove('hidden');
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

    // Modal
    this.modalContainerNetworks?.classList.add('hidden');
    this.modalContainerMoreNetworks?.classList.add('hidden');
    this.modalBtnMoreNetworks?.classList.remove('hidden');

    this.modalContainerCryptoPayment?.classList.add('hidden');

    this.modalOverpaidWarning?.classList.add('hidden');
    this.modalOverpaidLessThanGasFeesWarning?.classList.add('hidden');
    this.modalTransactionOverpaidAmountUSDTContainer?.classList.add('hidden');
    this.modalTransactionReturnAmountUSDTContainer?.classList.add('hidden');

    this.modalUnderpaidWarning?.classList.add('hidden');
    this.modalUnderpaidAmountsBlock?.classList.add('hidden');

    this.modalUnderpaidButtonsContainer?.classList.add('hidden');

    if (this.modalTitle) {
      this.modalTitle.innerText = 'Select an Asset';
    }
    this.modalBtnBack?.classList.remove('hidden');

    this.modalHeaderButtonNeedHelp?.classList.add('hidden');
    this.modalTransactionCompleteButtonNeedHelp?.classList.add('hidden');
    this.modalOverpaidButtonNeedHelp?.classList.add('hidden');
    this.modalUnderpaidButtonNeedHelp?.classList.add('hidden');

    if (this.sdkConfig?.support && (this.sdkConfig?.support.email || this.sdkConfig?.support.link)) {
      this.modalHeaderButtonNeedHelp?.classList.remove('hidden');
      this.modalTransactionCompleteButtonNeedHelp?.classList.remove('hidden');
      this.modalOverpaidButtonNeedHelp?.classList.remove('hidden');
      this.modalUnderpaidButtonNeedHelp?.classList.remove('hidden');

      if (this.modalHeaderButtonNeedHelp) {
        this.modalHeaderButtonNeedHelp.href = this.sdkConfig?.support.link ? this.sdkConfig?.support.link : `mailto: ${this.sdkConfig?.support.email}`;
      }
      if (this.modalTransactionCompleteButtonNeedHelp) {
        this.modalTransactionCompleteButtonNeedHelp.href = this.sdkConfig?.support.link ? this.sdkConfig?.support.link : `mailto: ${this.sdkConfig?.support.email}`;
      }
      if (this.modalOverpaidButtonNeedHelp) {
        this.modalOverpaidButtonNeedHelp.href = this.sdkConfig?.support.link ? this.sdkConfig?.support.link : `mailto: ${this.sdkConfig?.support.email}`;
      }
      if (this.modalUnderpaidButtonNeedHelp) {
        this.modalUnderpaidButtonNeedHelp.href = this.sdkConfig?.support.link ? this.sdkConfig?.support.link : `mailto: ${this.sdkConfig?.support.email}`;
      }
    }

    if (this.modalButtonAcceptTransactionModalClose) {
      this.modalButtonAcceptTransactionModalClose.innerText = 'Close';
    }
    if (this.modalCloseTransactionModalDescription) {
      this.modalCloseTransactionModalDescription.innerText = 'Are you sure you want to close this modal? If you continue, you will loose any progress you have made.';
    }

    this.cryptoTransaction = null;

    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
      if (this.displayExpirationLeft?.innerHTML) this.displayExpirationLeft.innerHTML = '15:00';
      if (this.modalDisplayExpirationLeft?.innerHTML) this.modalDisplayExpirationLeft.innerHTML = '15:00';
    }

    // KYC & Travel Rules (Modal UI)
    this.modalContainerKYCAndTravelRulesContainer?.classList.add('hidden');
    this.modalDocumentFileBackContainer?.classList.remove('hidden');

    if (this.modalEmail) {
      this.modalEmail.value = '';
    }
    if (this.modalFirstName) {
      this.modalFirstName.value = '';
    }
    if (this.modalLastName) {
      this.modalLastName.value = '';
    }
    if (this.modalStreet) {
      this.modalStreet.value = '';
    }
    if (this.modalCity) {
      this.modalCity.value = '';
    }
    if (this.modalRegion) {
      this.modalRegion.value = '';
    }
    if (this.modalPostalCode) {
      this.modalPostalCode.value = '';
    }
    if (this.modalCountry) {
      this.modalCountry.value = 'US';
    }
    if (this.modalDocumentType) {
      this.modalDocumentType.value = 'ID_CARD';
    }
    if (this.modalDocumentFileFront) {
      this.modalDocumentFileFront.value = '';
    }
    if (this.modalDocumentFileBack) {
      this.modalDocumentFileBack.value = '';
    }

    // KYC & Travel Rules (Embedded UI)
    this.containerKYCAndTravelRules?.classList.add('hidden');
    this.documentFileBackContainer?.classList.remove('hidden');

    if (this.email) {
      this.email.value = '';
    }
    if (this.firstName) {
      this.firstName.value = '';
    }
    if (this.lastName) {
      this.lastName.value = '';
    }
    if (this.street) {
      this.street.value = '';
    }
    if (this.city) {
      this.city.value = '';
    }
    if (this.region) {
      this.region.value = '';
    }
    if (this.postalCode) {
      this.postalCode.value = '';
    }
    if (this.country) {
      this.country.value = 'US';
    }
    if (this.documentType) {
      this.documentType.value = 'ID_CARD';
    }
    if (this.documentFileFront) {
      this.documentFileFront.value = '';
    }
    if (this.documentFileBack) {
      this.documentFileBack.value = '';
    }
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
      case AllowedAssetArbitrum:
        this.selectedAsset = AssetArbitrum;
        break;
      case AllowedAssetBase:
        this.selectedAsset = AssetBase;
        break;
      case AllowedAssetCelo:
        this.selectedAsset = AssetCelo;
        break;
      case AllowedAssetLinea:
        this.selectedAsset = AssetLinea;
        break;
      case AllowedAssetOPMainnet:
        this.selectedAsset = AssetOPMainnet;
        break;
      case AllowedAssetPolygon:
        this.selectedAsset = AssetPolygon;
        break;
      case AllowedAssetSonic:
        this.selectedAsset = AssetSonic;
        break;
      case AllowedAssetUnichain:
        this.selectedAsset = AssetUnichain;
        break;
      case AllowedAssetZKsync:
        this.selectedAsset = AssetZKsync;
        break;
      case AllowedAssetRLUSD:
        this.selectedAsset = AssetRLUSD;
        break;
      case AllowedAssetPYUSD:
        this.selectedAsset = AssetPYUSD;
        break;
      case AllowedAssetUSDe:
        this.selectedAsset = AssetUSDe;
        break;
      case AllowedAssetUSDS:
        this.selectedAsset = AssetUSDS;
        break;
      case AllowedAssetDai:
        this.selectedAsset = AssetDAI;
        break;
      case AllowedAssetUSDP:
        this.selectedAsset = AssetUSDP;
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
    if (this.initOptions?.isEmbedded) {
      this.containerPaymentSuccess?.classList.remove('hidden');
    } else {
      this.modalContainerPaymentSuccess?.classList.remove('hidden');
    }
    this.hideButtons();
    this.hideQRCode();
  }

  private showPaymentFailure(): void {
    if (this.initOptions?.isEmbedded) {
      this.containerPaymentFailure?.classList.remove('hidden');
    } else {
      this.modalContainerPaymentFailure?.classList.remove('hidden');
    }
    this.hideButtons();
    this.hideQRCode();
  }

  private hidePaymentSuccess(): void {
    if (this.initOptions?.isEmbedded) {
      this.containerPaymentSuccess?.classList.add('hidden');
    } else {
      this.modalContainerPaymentSuccess?.classList.add('hidden');
    }
  }

  private showProcessing(message: string = 'Processing...'): void {
    if (this.initOptions?.isEmbedded && this.lydianProcessingText) {
      this.lydianProcessingText.innerHTML = message;
    } else if (this.modalLydianProcessingText) {
      this.modalLydianProcessingText.innerHTML = message;
    }
    if (this.initOptions?.isEmbedded) {
      this.lydianProcessingContainer?.classList.remove('hidden');
    } else {
      this.modalLydianProcessingContainer?.classList.remove('hidden');
    }
  }

  private hideProcessing(): void {
    if (this.initOptions?.isEmbedded && this.lydianProcessingText) {
      this.lydianProcessingText.innerHTML = '';
    } else if (this.modalLydianProcessingText) {
      this.modalLydianProcessingText.innerHTML = '';
    }
    if (this.initOptions?.isEmbedded) {
      this.lydianProcessingContainer?.classList.add('hidden');
    } else {
      this.modalLydianProcessingContainer?.classList.add('hidden');
    }
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
    this.modalContainerCryptoPayment?.classList.add('hidden');
    this.modalContainerNetworks?.classList.add('hidden');
  }

  private showQRCode(qrData: string, amount: number, address: string, additionalCustomerFee: number): void {
    if (!this.selectedAsset) {
      return;
    }
    const assetTotal = amount + ' ' + this.selectedAsset.code.toUpperCase();
    const network = this.selectedNetwork ? capitalizeFirstLetter(this.selectedNetwork) : this.selectedAsset.networks[0];
    const transactionID = <string>this.initOptions?.transaction.referenceNumber;
    const totalAmount = <string>this.initOptions?.transaction.amount.toLocaleString('en-US', {
      style: 'currency',
      currency: this.initOptions?.transaction.currency,
    });
    const additionalCustomerFeeString = <string>additionalCustomerFee.toLocaleString('en-US', {
      style: 'currency',
      currency: this.initOptions?.transaction.currency,
    });

    if (this.initOptions?.isEmbedded) {
      this.containerQRCode?.classList.remove('hidden');
      if (this.displayAssetTotal) {
        this.displayAssetTotal.innerText = assetTotal;
      }
      if (this.displayAdditionalCustomerFee && additionalCustomerFee > 0) {
        this.displayAdditionalCustomerFee.innerText = additionalCustomerFeeString;
      }
      if (this.displayTransactionID) {
        this.displayTransactionID.innerText = transactionID;
      }
      if (this.displayTotalAmount) {
        this.displayTotalAmount.innerText = totalAmount;
      }
    } else {
      this.modalContainerQRCode?.classList.remove('hidden');
      if (this.modalDisplayAssetTotal) {
        this.modalDisplayAssetTotal.innerText = assetTotal;
      }
      // if (this.modalDisplayTransactionID) {
      //   this.modalDisplayTransactionID.innerText = transactionID;
      // }
      // if (this.modalDisplayTotalAmount) {
      //   this.modalDisplayTotalAmount.innerText = totalAmount;
      // }
      if (this.modalTitle) {
        this.modalTitle.innerText = 'Scan with Your Wallet';
      }
      if (this.modalDisplayNetwork) {
        this.modalDisplayNetwork.innerText = network;
      }
      if (this.modalDisplayWalletAddress) {
        this.modalDisplayWalletAddress.innerText = address;
      }
    }

    let clock = null;
    if (this.initOptions?.isEmbedded && this.displayExpirationLeft) {
      clock = this.displayExpirationLeft;
    } else if (this.modalDisplayExpirationLeft) {
      clock = this.modalDisplayExpirationLeft;
    }

    if (clock) {
      const expirationTime = new Date().getTime() + 15 * 60 * 1000;

      this.timeInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = expirationTime - now;

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        clock.innerHTML = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
        if (distance <= 0 && this.timeInterval) {
          clearInterval(this.timeInterval);
        }
      }, 1000);
    }


    const scanText = 'Scan the code below using your <br />CAMERA, CRYPTO WALLET, or QR READER';
    if (this.initOptions?.isEmbedded && this.displayScanText && this.selectedWallet.code == 'manual') {
      this.displayScanText.innerHTML = scanText;
    } else if (this.modalDisplayScanText && this.selectedWallet.code == 'manual') {
      this.modalDisplayScanText.innerHTML = scanText;
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

    // Clear Canvas
    if (this.canvasQRCode) {
      this.canvasQRCode.innerHTML = '';
    }
    if (this.modalCanvasQRCode) {
      this.modalCanvasQRCode.innerHTML = '';
    }

    const qrCode = new QRCodeStyling({
      width: 238,
      height: 238,
      type: 'canvas',
      data: qrData,
      image: centerImg,
      dotsOptions: {
        color: '#000000',
        type: 'extra-rounded',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
    });

    if (this.initOptions?.isEmbedded && this.canvasQRCode) {
      qrCode.append(this.canvasQRCode);
    } else if (this.modalCanvasQRCode) {
      qrCode.append(this.modalCanvasQRCode);
    }
  }

  private hideQRCode(): void {
    if (this.initOptions?.isEmbedded) {
      this.containerQRCode?.classList.add('hidden');
      if (this.canvasQRCode) {
        this.canvasQRCode.innerHTML = '';
      }
    } else {
      this.modalContainerQRCode?.classList.add('hidden');
      if (this.modalCanvasQRCode) {
        this.modalCanvasQRCode.innerHTML = '';
      }
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


    this.assetImg = this.shadowRoot?.getElementById('assetImg') as HTMLImageElement;
    this.assetTitle = this.shadowRoot?.getElementById('assetTitle') as HTMLDivElement;

    this.containerCryptoPayment = this.shadowRoot?.getElementById('containerCryptoPayment') as HTMLDivElement;
    this.containerAssets = this.shadowRoot?.getElementById('containerAssets') as HTMLDivElement;
    this.containerAssetsMore = this.shadowRoot?.getElementById('containerAssetsMore') as HTMLDivElement;

    this.canvasQRCode = this.shadowRoot?.getElementById('canvasQRCode') as HTMLDivElement;

    this.displayTotalAmount = this.shadowRoot?.getElementById('displayTotalAmount') as HTMLTableCellElement;
    this.displayTransactionID = this.shadowRoot?.getElementById('displayTransactionID') as HTMLTableCellElement;
    this.displayAssetTotal = this.shadowRoot?.getElementById('displayAssetTotal') as HTMLTableCellElement;
    this.displayAdditionalCustomerFee = this.shadowRoot?.getElementById('displayAdditionalCustomerFee') as HTMLTableCellElement;
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

    this.modal = this.shadowRoot?.getElementById('modal') as HTMLDialogElement;
    this.modalBtnBack = this.shadowRoot?.getElementById('modalBtnBack') as HTMLButtonElement;

    this.modalContainerNetworks = this.shadowRoot?.getElementById('modalContainerNetworks') as HTMLDivElement;

    this.modalContainerMoreNetworks = this.shadowRoot?.getElementById('modalContainerMoreNetworks') as HTMLDivElement;
    this.modalContainerNetworks = this.shadowRoot?.getElementById('modalContainerNetworks') as HTMLDivElement;
    this.modalContainerNetworkList = this.shadowRoot?.getElementById('modalContainerNetworkList') as HTMLDivElement;
    this.modalBtnMoreNetworks = this.shadowRoot?.getElementById('modalBtnMoreNetworks') as HTMLButtonElement;

    this.modalContainerPaymentSuccess = this.shadowRoot?.getElementById('modalContainerPaymentSuccess') as HTMLDivElement;
    this.modalContainerPaymentFailure = this.shadowRoot?.getElementById('modalContainerPaymentFailure') as HTMLDivElement;
    this.modalContainerQRCode = this.shadowRoot?.getElementById('modalContainerQRCode') as HTMLDivElement;
    this.modalLydianProcessingContainer = this.shadowRoot?.getElementById('modalLydianProcessingContainer') as HTMLDivElement;
    this.modalLydianProcessingText = this.shadowRoot?.getElementById('modalLydianProcessingText') as HTMLParagraphElement;

    this.modalContainerCryptoPayment = this.shadowRoot?.getElementById('modalContainerCryptoPayment') as HTMLDivElement;
    this.modalContainerAssets = this.shadowRoot?.getElementById('modalContainerAssets') as HTMLDivElement;

    this.modalCanvasQRCode = this.shadowRoot?.getElementById('modalCanvasQRCode') as HTMLDivElement;

    // this.modalDisplayTotalAmount = this.shadowRoot?.getElementById('modalDisplayTotalAmount') as HTMLTableCellElement;
    // this.modalDisplayTransactionID = this.shadowRoot?.getElementById('modalDisplayTransactionID') as HTMLTableCellElement;
    // this.modalDisplayAssetTotal = this.shadowRoot?.getElementById('modalDisplayAssetTotal') as HTMLTableCellElement;
    this.modalDisplayAssetTotal = this.shadowRoot?.getElementById('modalDisplayAssetTotal') as HTMLParagraphElement;
    this.modalDisplayScanText = this.shadowRoot?.getElementById('modalDisplayScanText') as HTMLSpanElement;
    // this.modalDisplayExpirationLeft = this.shadowRoot?.getElementById('modalDisplayExpirationLeft') as HTMLTableCellElement;
    this.modalDisplayExpirationLeft = this.shadowRoot?.getElementById('modalDisplayExpirationLeft') as HTMLSpanElement;

    this.modalAssetImg = this.shadowRoot?.getElementById('modalAssetImg') as HTMLImageElement;
    this.modalAssetTitle = this.shadowRoot?.getElementById('modalAssetTitle') as HTMLDivElement;

    this.modalTitle = this.shadowRoot?.getElementById('modalTitle') as HTMLDivElement;

    this.modalDisplayNetwork = this.shadowRoot?.getElementById('modalDisplayNetwork') as HTMLSpanElement;
    this.modalDisplayWalletAddress = this.shadowRoot?.getElementById('modalDisplayWalletAddress') as HTMLParagraphElement;
    this.modalButtonCopyAssetTotal = this.shadowRoot?.getElementById('modalButtonCopyAssetTotal') as HTMLButtonElement;
    this.modalButtonCopyWalletAddress = this.shadowRoot?.getElementById('modalButtonCopyWalletAddress') as HTMLButtonElement;

    this.modalTransactionOverpaidAmountUSDTContainer = this.shadowRoot?.getElementById('modalTransactionOverpaidAmountUSDTContainer') as HTMLDivElement;
    this.modalTransactionReturnAmountUSDTContainer = this.shadowRoot?.getElementById('modalTransactionReturnAmountUSDTContainer') as HTMLDivElement;
    this.modalLydianID = this.shadowRoot?.getElementById('modalLydianID') as HTMLSpanElement;
    this.modalTransactionAmount = this.shadowRoot?.getElementById('modalTransactionAmount') as HTMLSpanElement;
    this.modalTransactionAmountUSDT = this.shadowRoot?.getElementById('modalTransactionAmountUSDT') as HTMLSpanElement;
    this.modalTransactionTotalAmountUSDT = this.shadowRoot?.getElementById('modalTransactionTotalAmountUSDT') as HTMLSpanElement;
    this.modalTransactionOverpaidAmountUSDT = this.shadowRoot?.getElementById('modalTransactionOverpaidAmountUSDT') as HTMLSpanElement;
    this.modalTransactionReturnAmountUSDT = this.shadowRoot?.getElementById('modalTransactionReturnAmountUSDT') as HTMLSpanElement;
    this.modalOverpaidWarning = this.shadowRoot?.getElementById('modalOverpaidWarning') as HTMLDivElement;
    this.modalOverpaidLessThanGasFeesWarning = this.shadowRoot?.getElementById('modalOverpaidLessThanGasFeesWarning') as HTMLDivElement;

    this.modalUnderpaidWarning = this.shadowRoot?.getElementById('modalUnderpaidWarning') as HTMLDivElement;
    this.modalUnderpaidAmountsBlock = this.shadowRoot?.getElementById('modalUnderpaidAmountsBlock') as HTMLDivElement;
    this.modalTransactionAmountForUnderpaidWarning = this.shadowRoot?.getElementById('modalTransactionAmountForUnderpaidWarning') as HTMLSpanElement;
    this.modalTransactionAmountForUnderpaid = this.shadowRoot?.getElementById('modalTransactionAmountForUnderpaid') as HTMLSpanElement;
    this.modalTransactionPaidAmountForUnderpaid = this.shadowRoot?.getElementById('modalTransactionPaidAmountForUnderpaid') as HTMLSpanElement;

    this.modalTransactionDetailsContainer = this.shadowRoot?.getElementById('modalTransactionDetailsContainer') as HTMLDivElement;
    this.modalTransactionDetailItemsContainer = this.shadowRoot?.getElementById('modalTransactionDetailItemsContainer') as HTMLDivElement;
    this.modalButtonTransactionDetails = this.shadowRoot?.getElementById('modalButtonTransactionDetails') as HTMLButtonElement;

    this.modalUnderpaidButtonsContainer = this.shadowRoot?.getElementById('modalUnderpaidButtonsContainer') as HTMLDivElement;
    this.modalButtonCancelTransaction = this.shadowRoot?.getElementById('modalButtonCancelTransaction') as HTMLButtonElement;
    this.modalButtonChooseDifferentAsset = this.shadowRoot?.getElementById('modalButtonChooseDifferentAsset') as HTMLButtonElement;

    this.modalCancelTransaction = this.shadowRoot?.getElementById('modalCancelTransaction') as HTMLDialogElement;
    this.modalButtonRejectCancelTransaction = this.shadowRoot?.getElementById('modalButtonRejectCancelTransaction') as HTMLButtonElement;
    this.modalButtonAcceptCancelTransaction = this.shadowRoot?.getElementById('modalButtonAcceptCancelTransaction') as HTMLButtonElement;

    this.modalHeaderButtonNeedHelp = this.shadowRoot?.getElementById('modalHeaderButtonNeedHelp') as HTMLAnchorElement;
    this.modalTransactionCompleteButtonNeedHelp = this.shadowRoot?.getElementById('modalTransactionCompleteButtonNeedHelp') as HTMLAnchorElement;
    this.modalOverpaidButtonNeedHelp = this.shadowRoot?.getElementById('modalOverpaidButtonNeedHelp') as HTMLAnchorElement;
    this.modalUnderpaidButtonNeedHelp = this.shadowRoot?.getElementById('modalUnderpaidButtonNeedHelp') as HTMLAnchorElement;

    this.modalCloseTransactionModal = this.shadowRoot?.getElementById('modalCloseTransactionModal') as HTMLDialogElement;
    this.modalButtonAcceptTransactionModalClose = this.shadowRoot?.getElementById('modalButtonAcceptTransactionModalClose') as HTMLButtonElement;
    this.modalButtonRejectTransactionModalClose = this.shadowRoot?.getElementById('modalButtonRejectTransactionModalClose') as HTMLButtonElement;
    this.modalCloseTransactionModalDescription = this.shadowRoot?.getElementById('modalCloseTransactionModalDescription') as HTMLParagraphElement;

    // KYC & Travel Rules (Modal UI)
    this.modalContainerKYCAndTravelRulesContainer = this.shadowRoot?.getElementById('modalContainerKYCAndTravelRulesContainer') as HTMLDivElement;
    this.modalEmail = this.shadowRoot?.getElementById('modalEmail') as HTMLInputElement;
    this.modalFirstName = this.shadowRoot?.getElementById('modalFirstName') as HTMLInputElement;
    this.modalLastName = this.shadowRoot?.getElementById('modalLastName') as HTMLInputElement;
    this.modalStreet = this.shadowRoot?.getElementById('modalStreet') as HTMLInputElement;
    this.modalCity = this.shadowRoot?.getElementById('modalCity') as HTMLInputElement;
    this.modalRegion = this.shadowRoot?.getElementById('modalRegion') as HTMLInputElement;
    this.modalPostalCode = this.shadowRoot?.getElementById('modalPostalCode') as HTMLInputElement;
    this.modalCountry = this.shadowRoot?.getElementById('modalCountry') as HTMLSelectElement;
    this.modalDocumentType = this.shadowRoot?.getElementById('modalDocumentType') as HTMLSelectElement;
    this.modalDocumentFileFront = this.shadowRoot?.getElementById('modalDocumentFileFront') as HTMLInputElement;
    this.modalDocumentFileBackContainer = this.shadowRoot?.getElementById('modalDocumentFileBackContainer') as HTMLDivElement;
    this.modalDocumentFileBack = this.shadowRoot?.getElementById('modalDocumentFileBack') as HTMLInputElement;
    this.modelButtonKYCVerificationAndTravelRules = this.shadowRoot?.getElementById('modelButtonKYCVerificationAndTravelRules') as HTMLButtonElement;

    // KYC & Travel Rules (Embedded UI)
    this.containerKYCAndTravelRules = this.shadowRoot?.getElementById('containerKYCAndTravelRules') as HTMLDivElement;
    this.email = this.shadowRoot?.getElementById('containerCustomerVerification') as HTMLInputElement;
    this.firstName = this.shadowRoot?.getElementById('firstName') as HTMLInputElement;
    this.lastName = this.shadowRoot?.getElementById('lastName') as HTMLInputElement;
    this.street = this.shadowRoot?.getElementById('street') as HTMLInputElement;
    this.city = this.shadowRoot?.getElementById('city') as HTMLInputElement;
    this.region = this.shadowRoot?.getElementById('region') as HTMLInputElement;
    this.postalCode = this.shadowRoot?.getElementById('postalCode') as HTMLInputElement;
    this.country = this.shadowRoot?.getElementById('country') as HTMLSelectElement;
    this.documentType = this.shadowRoot?.getElementById('documentType') as HTMLSelectElement;
    this.documentFileFront = this.shadowRoot?.getElementById('documentFileFront') as HTMLInputElement;
    this.documentFileBackContainer = this.shadowRoot?.getElementById('documentFileBackContainer') as HTMLDivElement;
    this.documentFileBack = this.shadowRoot?.getElementById('documentFileBack') as HTMLInputElement;
    this.buttonKYCVerificationAndTravelRules = this.shadowRoot?.getElementById('buttonKYCVerificationAndTravelRules') as HTMLButtonElement;
  }

  private attachListeners(): void {
    this.btnAppPayment?.addEventListener('click', (e) => {
      console.log('TODO: NOT IMPLEMENTED');
    });

    this.btnCryptoPayment?.addEventListener('click', () => {
      this.btnCryptoPayment?.classList.toggle('hidden');
      if (this.initOptions?.isEmbedded) {
        this.containerCryptoPayment?.classList.toggle('hidden');
      } else {
        this.modal?.showModal();
        this.modalContainerCryptoPayment?.classList.toggle('hidden');
      }
    });

    this.modalBtnBack?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (this.modalContainerPaymentSuccess?.classList.contains('hidden')) {
        this.modalCloseTransactionModal?.showModal();
      } else {
        this.modal?.close();
        this.loadInitialState();
      }
    });

    this.modalButtonAcceptTransactionModalClose?.addEventListener('click', () => {
      this.modalCloseTransactionModal?.close();
      this.modal?.close();
      this.loadInitialState();
    });

    this.modalButtonRejectTransactionModalClose?.addEventListener('click', () => {
      this.modalCloseTransactionModal?.close();
    });

    // Optional: click outside the dialog box to close (when not full-screen)
    this.modal?.addEventListener('click', (e) => {
      const r = this.modal?.getBoundingClientRect();
      let inDialog = null;
      if (r != null) {
        inDialog =
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom;
      }
      if (!inDialog) {
        if (this.modalContainerPaymentSuccess?.classList.contains('hidden')) {
          this.modalCloseTransactionModal?.showModal();
        } else {
          this.modal?.close();
          this.loadInitialState();
        }
      }
    });

    this.btnMoreNetworks?.addEventListener('click', () => {
      this.containerMoreNetworks?.classList.toggle('hidden');
      this.btnMoreNetworks?.classList.toggle('hidden');
    });

    this.modalBtnMoreNetworks?.addEventListener('click', () => {
      this.modalContainerMoreNetworks?.classList.toggle('hidden');
      this.modalBtnMoreNetworks?.classList.toggle('hidden');
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

    this.modalButtonCopyAssetTotal?.addEventListener('click', (event) => {
      const asset = this.modalDisplayAssetTotal?.innerText ?? '';
      navigator.clipboard.writeText(asset);
    });
    this.modalButtonCopyWalletAddress?.addEventListener('click', () => {
      const asset = this.modalDisplayWalletAddress?.innerText ?? '';
      navigator.clipboard.writeText(asset);
    });

    this.modalButtonTransactionDetails?.addEventListener('click', () => {
      this.modalTransactionDetailsContainer?.classList.toggle('hidden');
    });

    this.modalButtonCancelTransaction?.addEventListener('click', () => {
      this.modalCancelTransaction?.showModal();
    });

    this.modalButtonChooseDifferentAsset?.addEventListener('click', () => {
      this.clearInterval();
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
        if (this.displayExpirationLeft?.innerHTML) this.displayExpirationLeft.innerHTML = '15:00';
        if (this.modalDisplayExpirationLeft?.innerHTML) this.modalDisplayExpirationLeft.innerHTML = '15:00';
      }
      if (this.modalTitle) {
        this.modalTitle.innerText = 'Select an Asset';
      }
      this.modalContainerCryptoPayment?.classList.remove('hidden');
      // requestAnimationFrame was added because when a block of item was hidden that contained the button, the whole modal was closing.
      requestAnimationFrame(() => this.modalContainerQRCode?.classList.add('hidden'));
    });

    this.modalButtonRejectCancelTransaction?.addEventListener('click', () => {
      this.modalCancelTransaction?.close();
    });

    this.modalButtonAcceptCancelTransaction?.addEventListener('click', () => {
      if (this.cryptoTransaction?.transactionId && this.API) {
        this.API.cancelCryptoTransaction(this.cryptoTransaction?.transactionId, {
          reason: 'Cancelled from the SDK',
        });
      }
      this.modalCancelTransaction?.close();
      this.modal?.close();
      this.cryptoTransaction = null;
      this.loadInitialState();
      this.initOptions?.paymentCanceledListener();
    });

    // KYC & Travel Rules
    this.modalDocumentType?.addEventListener('change', (e) => {
      if (this.modalDocumentType?.value === 'PASSPORT' || this.modalDocumentType?.value === 'RESIDENCE_PERMIT') {
        this.modalDocumentFileBackContainer?.classList?.add('hidden');
      } else {
        this.modalDocumentFileBackContainer?.classList?.remove('hidden');
      }
    });
    this.documentType?.addEventListener('change', (e) => {
      if (this.documentType?.value === 'PASSPORT' || this.documentType?.value === 'RESIDENCE_PERMIT') {
        this.documentFileBackContainer?.classList?.add('hidden');
      } else {
        this.documentFileBackContainer?.classList?.remove('hidden');
      }
    });

    this.modelButtonKYCVerificationAndTravelRules?.addEventListener('click', async () => {
      await this.handleKYCAndTravelRulesFormSubmission();
    });
    this.buttonKYCVerificationAndTravelRules?.addEventListener('click', async () => {
      await this.handleKYCAndTravelRulesFormSubmission();
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
          let gasFeesUSDT = 0.0;
          let completedCryptoTransactions: CryptoTransaction[] = [];
          let hasPendingCryptoTransaction = false;
          for (const [id, tx] of Object.entries(transaction.cryptoTransactions)) {
            const txExpirationDateTime = Date.parse(tx.expiration);
            const txCurrentDateTime = Date.now();
            if (tx.status === CryptoTransactionStatusSuccess) {
              gasFeesUSDT -= convertCryptoToUSDT(tx.gasFee, tx.cryptoAsset);
              completedCryptoTransactions.push(tx);
            } else if (tx.status === CryptoTransactionStatusPending && txExpirationDateTime >= txCurrentDateTime) {
              hasPendingCryptoTransaction = true;
            }
          }

          const transactionAmountUSDT = convertAmountToUSDT(transaction.amount, transaction.amountCurrency);
          const paidAmountUSDT = convertAmountToUSDT(transaction.amount - transaction.remainingBalance, transaction.amountCurrency);
          const overpaidAmountUSDT = +(paidAmountUSDT - transactionAmountUSDT).toFixed(2);
          const returnAmountUSDT = +(overpaidAmountUSDT + gasFeesUSDT).toFixed(2);

          this.modalLydianID!.innerText = transaction.transactionID;
          this.modalTransactionAmount!.innerText = formatCurrency(transaction.amount);
          this.modalTransactionAmountUSDT!.innerText = transactionAmountUSDT.toString();
          this.modalTransactionTotalAmountUSDT!.innerText = paidAmountUSDT.toString();
          this.modalTransactionOverpaidAmountUSDT!.innerText = overpaidAmountUSDT.toString();
          this.modalTransactionReturnAmountUSDT!.innerText = returnAmountUSDT.toString();
          this.modalTransactionAmountForUnderpaidWarning!.innerText = formatCurrency(transaction.amount, transaction.amountCurrency);
          this.modalTransactionAmountForUnderpaid!.innerText = formatCurrency(transaction.amount, transaction.amountCurrency);
          this.modalTransactionPaidAmountForUnderpaid!.innerText = formatCurrency(transaction.amount - transaction.remainingBalance, transaction.amountCurrency);

          if (this.modalTransactionDetailItemsContainer) {
            this.modalTransactionDetailItemsContainer!.innerHTML = '';
            completedCryptoTransactions.forEach(cryptoTransaction => {
              this.modalTransactionDetailItemsContainer!.innerHTML += `
                <div class="flex items-bottom justify-between mt-2">
                  <div class="flex flex-col">
                    <p class="font-bold">${formatDateForTransactionDetails(cryptoTransaction.createdAt)}</p>
                  </div>
                  <span class="mb-1.5 grow mx-1 border-b border-dotted border-neutral-400"></span>
                  <div class="flex flex-col text-right">
                    <p><span class="font-bold">${formatCurrency(cryptoTransaction.amount, transaction.amountCurrency)} ${cryptoTransaction.cryptoAsset}</span> on ${cryptoTransaction.cryptoNetwork}</p>
                  </div>
                </div>
              `;
            });
          }

          let transactionCompleted = false;
          let insufficientAmount = false;

          if (returnAmountUSDT > 0) {
            this.modalTransactionOverpaidAmountUSDTContainer?.classList.remove('hidden');
            this.modalOverpaidWarning?.classList.remove('hidden');
            this.modalTransactionReturnAmountUSDTContainer?.classList.remove('hidden');
            transactionCompleted = true;
          } else if (paidAmountUSDT > transactionAmountUSDT) {
            this.modalTransactionOverpaidAmountUSDTContainer?.classList.remove('hidden');
            this.modalOverpaidLessThanGasFeesWarning?.classList?.remove('hidden');
            transactionCompleted = true;
          } else if (completedCryptoTransactions.length > 0 && paidAmountUSDT < transactionAmountUSDT) {
            insufficientAmount = true;
            this.processingUnderpayment = true;
          } else if (paidAmountUSDT === transactionAmountUSDT && transaction.status === CryptoTransactionStatusSuccess) {
            transactionCompleted = true;
          }

          const expirationDateTime = Date.parse(transaction.expiration);
          const currentDateTime = Date.now();

          if (transactionCompleted) {
            this.clearInterval();
            this.showPaymentSuccess();
            this.initOptions?.paymentSuccessListener?.();
          } else if (!this.initOptions?.isEmbedded && insufficientAmount && this.API) {
            // TODO: Implement it for embedded UI,
            // TODO: UI for overpayment should also be updated for the embedded UI.
            try {
              if (this.selectedAsset && this.selectedNetwork) {
                if (!hasPendingCryptoTransaction) {
                  this.clearInterval();
                  if (this.timeInterval) {
                    clearInterval(this.timeInterval);
                    this.timeInterval = null;
                    if (this.displayExpirationLeft?.innerHTML) this.displayExpirationLeft.innerHTML = '15:00';
                    if (this.modalDisplayExpirationLeft?.innerHTML) this.modalDisplayExpirationLeft.innerHTML = '15:00';
                  }
                  await this.beginWalletConnectTransaction();
                }
                this.modalUnderpaidWarning?.classList.remove('hidden');
                this.modalUnderpaidAmountsBlock?.classList.remove('hidden');
                this.modalUnderpaidButtonsContainer?.classList.remove('hidden');
                if (this.modalTitle) {
                  this.modalTitle.innerText = 'Pay Remaining Balance';
                }
                this.modalBtnBack?.classList.add('hidden');
                if (this.sdkConfig?.cancelTransactionEnabled) {
                  if (this.modalButtonAcceptTransactionModalClose) {
                    this.modalButtonAcceptTransactionModalClose.innerText = 'Close and Forfeit Funds';
                  }
                  if (this.modalCloseTransactionModalDescription) {
                    this.modalCloseTransactionModalDescription.innerText = `Are you sure you want to close this modal? If you continue, you will forfeit the ${paidAmountUSDT} USDT already transferred, and your order will not be placed.`;
                  }
                }
              } else {
                this.loadInitialState();
              }
            } catch (error) {
              console.log('error', error);
              this.initOptions?.paymentFailedListener?.('Unable to collect underpaid amount.');
            }
          } else if (expirationDateTime < currentDateTime) {
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
            this.initOptions?.paymentSuccessListener?.();
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
    console.log('Clear interval called...');
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
    if (this.initOptions?.isEmbedded && (!this.containerAssets || !this.containerAssetsMore)) {
      return;
    } else if (!this.modalContainerAssets) {
      return;
    }

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
        case AllowedAssetSolana:
          return AssetButton(AssetSolana);
        case AllowedAssetRLUSD:
          return AssetButton(AssetRLUSD);
        case AllowedAssetPYUSD:
          return AssetButton(AssetPYUSD);
        case AllowedAssetUSDe:
          return AssetButton(AssetUSDe);
        case AllowedAssetUSDS:
          return AssetButton(AssetUSDS);
        case AllowedAssetDai:
          return AssetButton(AssetDAI);
        case AllowedAssetUSDP:
          return AssetButton(AssetUSDP);
      }
    });

    if (this.initOptions?.isEmbedded) {
      this.containerAssets!.innerHTML = '';
      this.containerAssetsMore!.innerHTML = '';

      buttons?.filter(v => v).forEach((button, index) => {
        if (index >= 2 && this.containerAssetsMore) {
          this.containerAssetsMore.innerHTML += button;
        } else if (this.containerAssets) {
          this.containerAssets.innerHTML += button;
        }
      });

    } else {
      this.modalContainerAssets!.innerHTML = '';

      buttons?.filter(v => v).forEach((button, index) => {
        if (this.modalContainerAssets) {
          this.modalContainerAssets.innerHTML += button;
        }
      });

    }

    if (this.sdkConfig?.allowedAssets && this.sdkConfig.allowedAssets.length <= 2) {
      this.btnMoreAssets?.classList.add('hidden');
    }


    this.attachListenersOnAssets();
  }

  private attachListenersOnAssets() {
    this.sdkConfig?.allowedAssets?.forEach((asset) => {
      const assetBtn = this.shadowRoot?.getElementById('btnAsset' + asset.code) as HTMLButtonElement;
      assetBtn?.addEventListener('click', async () => {
        this.setSelectedAsset(asset.code);

        if (this.initOptions?.isEmbedded) {
          requestAnimationFrame(() => this.containerCryptoPayment?.classList.add('hidden'));
        } else {
          requestAnimationFrame(() => this.modalContainerCryptoPayment?.classList.add('hidden'));
        }

        if (asset.type == 'token') {
          this.setNetworkButtons();
          if (this.modalTitle) {
            this.modalTitle.innerText = 'Select a Network';
          }
        } else {
          this.setSelectedNetwork(asset.networks[0]);
          await this.showWalletConnectButtons();
        }
      });
    });
  }

  private setNetworkButtons() {
    if (this.initOptions?.isEmbedded && (!this.containerNetworkList || !this.containerMoreNetworks || !this.assetTitle)) {
      return;
    }
    if (!this.initOptions?.isEmbedded && (!this.modalContainerNetworkList || !this.modalContainerMoreNetworks || !this.modalAssetTitle)) {
      return;
    }
    if (this.initOptions?.isEmbedded && !this.assetImg) {
      return;
    }
    if (!this.initOptions?.isEmbedded && !this.modalAssetImg) {
      return;
    }
    if (this.initOptions?.isEmbedded) {
      this.containerNetworkList!.innerHTML = '';
      this.containerMoreNetworks!.innerHTML = '';

      this.assetTitle!.innerHTML = <string>this.selectedAsset?.title;
      this.assetImg!.src = <string>this.selectedAsset?.img;
    } else {
      this.modalContainerNetworkList!.innerHTML = '';
      this.modalContainerMoreNetworks!.innerHTML = '';

      this.modalAssetTitle!.innerHTML = <string>this.selectedAsset?.title;
      this.modalAssetImg!.src = <string>this.selectedAsset?.img;
    }

    let allowedAssets = this.sdkConfig?.allowedAssets;
    const asset = allowedAssets?.find(a => a.code === this.selectedAsset?.code);
    if (asset == undefined) {
      console.log('Unknown asset: ', this.selectedAsset?.code);
      return;
    }
    console.log('asset', asset);

    asset?.networks.forEach((chain, index) => {
      let button;
      switch (chain) {
        case AllowedNetworkBitcoin:
          button = NetworkButton(NetworkBitcoin);
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
        case AllowedNetworkArbitrum:
          button = NetworkButton(NetworkArbitrum);
          break;
        case AllowedNetworkBase:
          button = NetworkButton(NetworkBase);
          break;
        case AllowedNetworkCelo:
          button = NetworkButton(NetworkCelo);
          break;
        case AllowedNetworkLinea:
          button = NetworkButton(NetworkLinea);
          break;
        case AllowedNetworkOPMainnet:
          button = NetworkButton(NetworkOPMainnet);
          break;
        case AllowedNetworkPolygon:
          button = NetworkButton(NetworkPolygon);
          break;
        case AllowedNetworkSonic:
          button = NetworkButton(NetworkSonic);
          break;
        case AllowedNetworkUnichain:
          button = NetworkButton(NetworkUnichain);
          break;
        case AllowedNetworkZKsync:
          button = NetworkButton(NetworkZKsync);
          break;
        case AllowedNetworkSui:
          button = NetworkButton(NetworkSui);
          break;
        case AllowedNetworkTezos:
          button = NetworkButton(NetworkTezos);
          break;
        case AllowedNetworkKaia:
          button = NetworkButton(NetworkKaia);
          break;
        case AllowedNetworkEos:
          button = NetworkButton(NetworkEos);
          break;
        case AllowedNetworkUniswap:
          button = NetworkButton(NetworkUniswap);
          break;
        case AllowedNetworkHedara:
          button = NetworkButton(NetworkHedara);
          break;
        case AllowedNetworkNear:
          button = NetworkButton(NetworkNear);
          break;
      }

      if (index >= 4 && this.initOptions?.isEmbedded && this.containerMoreNetworks) {
        this.containerMoreNetworks.innerHTML += button;
      } else if (index >= 4 && !this.initOptions?.isEmbedded && this.modalContainerMoreNetworks) {
        this.modalContainerMoreNetworks.innerHTML += button;
      } else if (this.initOptions?.isEmbedded && this.containerNetworkList) {
        this.containerNetworkList.innerHTML += button;
      } else if (this.modalContainerNetworkList) {
        this.modalContainerNetworkList.innerHTML += button;
      }
    });

    if (asset?.networks && asset?.networks.length <= 2) {
      this.btnMoreNetworks?.classList.add('hidden');
      this.modalBtnMoreNetworks?.classList.add('hidden');
    }

    if (this.initOptions?.isEmbedded) {
      this.containerNetworks?.classList.remove('hidden');
    } else {
      this.modalContainerNetworks?.classList.remove('hidden');
    }

    this.attachListenerOnNetworks(asset.networks);
  }

  private attachListenerOnNetworks(networks: string[]) {
    networks?.forEach((networkCode) => {
      const networkBtn = this.shadowRoot?.getElementById('btnNetwork' + networkCode) as HTMLButtonElement;
      networkBtn?.addEventListener('click', async () => {
        this.setSelectedNetwork(networkCode);
        await this.showWalletConnectButtons();
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
        this.API.setClusterBaseUri(this.sdkConfig.lydianPayCluster);
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

    if (this.initOptions?.isEmbedded) {
      requestAnimationFrame(() => this.containerNetworks?.classList.add('hidden'));
    } else {
      requestAnimationFrame(() => this.modalContainerNetworks?.classList.add('hidden'));
    }

    this.connectWalletButtonsContainer.classList.remove('hidden');

    const manualQrButton = {
      id: 'manual',
      name: 'Manual QR Code',
      img: 'https://tetherpay.com/images/95de9fd2-da4f-4415-3ec7-bb1befdbc500/public',
    };

    if (!this.sdkConfig?.walletConnectEnabled) {
      this.setSelectedWallet(manualQrButton);
      await this.beginWalletConnectTransaction();
      this.lydianBtnCancelWalletConnect?.addEventListener('click', async () => {
        this.loadInitialState();
      });
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
        wcPeerName: 'MetaMask Wallet',
      },
      {
        id: 'trustwallet',
        name: 'Trust Wallet',
        img: 'https://logowik.com/content/uploads/images/trust-wallet-shield4830.logowik.com.webp',
        wcPeerName: 'Trust Wallet',
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
        await this.beginWalletConnectTransaction();
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

    this.showProcessing('Generating QR Code');

    try {
      if (!this.processingUnderpayment || !this.cryptoTransaction?.transactionId) {
        this.cryptoTransaction = await this.API.createCryptoTransaction({
          descriptor: this.initOptions.transaction.descriptor,
          referenceNumber: this.initOptions.transaction.referenceNumber,
          amount: this.initOptions.transaction.amount,
          amountCurrency: this.initOptions.transaction.currency,
          asset: this.selectedAsset.code,
          network: this.selectedNetwork,
        });
      } else {
        this.cryptoTransaction = await this.API.collectCryptoTransaction(this.cryptoTransaction.transactionId, {
          asset: this.selectedAsset.code,
          network: this.selectedNetwork,
        });
      }
      console.log('transaction', this.cryptoTransaction);
      this.hideProcessing();

      if (this.cryptoTransaction.status === CryptoTransactionStatusPendingKYCVerification) {
        if (this.initOptions.isEmbedded) {
          this.containerKYCAndTravelRules?.classList.remove('hidden');
        } else {
          this.modalContainerKYCAndTravelRulesContainer?.classList.remove('hidden');
          if (this.modalTitle) {
            this.modalTitle.innerText = 'Submit Your Information';
          }
        }
      } else {
        await this.handleCreatedTransactionAndStartListening();
      }

    } catch (error) {
      this.hideProcessing();
      this.initOptions?.paymentFailedListener?.('Unable to create cryptotransaction.');
    }
  }

  private async handleCreatedTransactionAndStartListening() {
    if (!this.selectedAsset || !this.selectedNetwork) {
      this.initOptions?.paymentFailedListener?.('Asset and network selection required.');
      return;
    }
    if (!this.walletConnectService) {
      this.initOptions?.paymentFailedListener?.('Wallet Connect not initialized.');
      return;
    }
    if (!this.cryptoTransaction) {
      this.initOptions?.paymentFailedListener?.('Crypto transaction not created..');
      return;
    }
    if (this.selectedWallet.id == 'manual') {
      this.showQRCode(this.cryptoTransaction.qrData, this.cryptoTransaction.assetAmount, this.cryptoTransaction.address, this.cryptoTransaction.additionalCustomerFee);
    } else {

      let walletSession = this.walletConnectService?.findSession(this.selectedWallet);

      console.log('selected wallet', this.selectedWallet);
      console.log('matching wallet session', walletSession);

      // Display QR for session connection
      if (!walletSession) {
        const { uri, approval } = await this.walletConnectService?.connectWalletWithQrCode();

        if (uri) {
          this.showQRCode(uri, this.cryptoTransaction.assetAmount, this.cryptoTransaction.address, this.cryptoTransaction.additionalCustomerFee);
        }

        walletSession = await approval();

        console.log('Session established:', walletSession);
        this.walletConnectService.currentSession = walletSession;
        this.hideQRCode();
      }


      const fromAddress = this.walletConnectService.getSessionAddress(walletSession, 'eip155:1');
      if (!fromAddress) {
        throw new Error('failed to find wallet address from current session');
      }

      const params = parseQrCodeData(this.cryptoTransaction.qrData);
      console.log('parsedQrCodeData', params);

      let transferData;
      if (this.selectedAsset.code === 'USDT') {
        transferData = encodeEthereumUsdtTransfer({
          fromAddress: fromAddress as Address,
          toAddress: params.address,
          uint256: parseInt(params.uint256),
        });
      } else if (this.selectedAsset.code === 'USDC') {
        transferData = encodeEthereumUsdcTransfer({
          fromAddress: fromAddress as Address,
          toAddress: params.address,
          // TODO: remove once uint256 value is corrected for USDC
          uint256: parseFloat(params.uint256) * USDC_ERC20_MAIN.multiplier,
        });
      } else {
        throw new Error(`unable to encode unkown asset code "${this.selectedAsset.code}"`);
      }

      try {
        this.showProcessing(`Waiting for transaction approval from ${walletSession.peer.metadata.name}...`);
        const transferResp = await this.walletConnectService.sendEthTransaction(transferData, walletSession);
        // TODO: do something with this response?

        this.hideProcessing();
        this.showPaymentSuccess();
        this.clearInterval();
        this.initOptions?.paymentSuccessListener?.();
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
  }

  private async handleKYCAndTravelRulesFormSubmission() {
    if (!this.selectedAsset || !this.selectedNetwork) {
      this.initOptions?.paymentFailedListener?.('Asset and network selection required.');
      return;
    }
    if (!this.initOptions || !this.API) {
      this.initOptions?.paymentFailedListener?.('Lydian not initialized.');
      return;
    }
    if (!this.cryptoTransaction) {
      this.initOptions?.paymentFailedListener?.('Transaction not created.');
      return;
    }

    let email: string, firstName: string, lastName: string, street: string, city: string, region: string, postalCode: string, country: string, documentType: string;
    let documentFileFront: File | undefined, documentFileBack: File | undefined;

    if (this.initOptions.isEmbedded) {
      email = this.email?.value ?? '';
      firstName = this.firstName?.value ?? '';
      lastName = this.lastName?.value ?? '';
      street = this.street?.value ?? '';
      city = this.city?.value ?? '';
      region = this.region?.value ?? '';
      postalCode = this.postalCode?.value ?? '';
      country = this.country?.value ?? '';
      documentType = this.documentType?.value ?? '';
      documentFileFront = this.documentFileFront?.files?.[0];
      documentFileBack = this.documentFileBack?.files?.[0];
    } else {
      email = this.modalEmail?.value ?? '';
      firstName = this.modalFirstName?.value ?? '';
      lastName = this.modalLastName?.value ?? '';
      street = this.modalStreet?.value ?? '';
      city = this.modalCity?.value ?? '';
      region = this.modalRegion?.value ?? '';
      postalCode = this.modalPostalCode?.value ?? '';
      country = this.modalCountry?.value ?? '';
      documentType = this.modalDocumentType?.value ?? '';
      documentFileFront = this.modalDocumentFileFront?.files?.[0];
      documentFileBack = this.modalDocumentFileBack?.files?.[0];
    }

    if (this.cryptoTransaction?.requiredFields.includes(email) && email == '') {
      alert('Please enter your email address.');
      return;
    } else if (this.cryptoTransaction?.requiredFields.includes('firstName') && firstName == '') {
      alert('Please enter your first name.');
      return;
    } else if (this.cryptoTransaction?.requiredFields.includes('lastName') && lastName == '') {
      alert('Please enter your last name.');
      return;
    } else if (this.cryptoTransaction?.requiredFields.includes('address') &&
      (street == '' || city == '' || region == '' || postalCode == '' || country == '')) {
      alert('Please enter your complete address.');
      return;
    } else if (!documentFileFront) {
      alert('Please upload front image of the selected document.');
      return;
    } else if ((documentType === 'ID_CARD' || documentType === 'DRIVERS') && !documentFileBack) {
      alert('Please upload back image of the selected document.');
      return;
    }

    this.showProcessing('Submitting your information');

    // requestAnimationFrame was added because when a block of item was hidden that contained the button, the whole modal was closing.
    requestAnimationFrame(() => this.modalContainerKYCAndTravelRulesContainer?.classList.add('hidden'));
    this.containerKYCAndTravelRules?.classList.add('hidden');

    const kycVerificationRequest = {
      asset: this.selectedAsset.code,
      network: this.selectedNetwork,
      email: email,
      firstName: firstName,
      lastName: lastName,
      street: street,
      city: city,
      region: region,
      postalCode: postalCode,
      country: country,
      documentType: documentType,
      documentFiles: [documentFileFront],
    };
    if ((documentType === 'ID_CARD' || documentType === 'DRIVERS') && documentFileBack) {
      kycVerificationRequest.documentFiles.push(documentFileBack);
    }

    try {
      this.cryptoTransaction = await this.API.kycVerification(this.cryptoTransaction.transactionId, kycVerificationRequest);
      console.log('transaction', this.cryptoTransaction);
      this.hideProcessing();
      await this.handleCreatedTransactionAndStartListening();
    } catch (error) {
      this.hideProcessing();
      this.showPaymentFailure();
      this.clearInterval();
      this.initOptions?.paymentFailedListener?.('Unable to verify customer.');
    }
  }
}
