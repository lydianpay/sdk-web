import tetherPayCSS from './tetherpay.generated.css?inline';
import checkoutTemplate from './checkout-template.html?raw';
import {CreateWalletTransactionResponse, currencies, isCurrency, TetherPayOptions, Transaction} from "../types";
import QrCode from 'qrcode';
import {QRCodeDefaults, WalletTransactionStatusSuccess} from "../constants";
import {TetherPayApi} from "../network";
import isMobile from "is-mobile";

export class TetherPayCheckout extends HTMLElement {
    private shadow: ShadowRoot;
    private tetherPayOptions: TetherPayOptions | null = null;

    private walletTransaction: CreateWalletTransactionResponse | null = null;
    private tetherPayApi: TetherPayApi | null = null;
    private getWalletTransactionIntervalID: NodeJS.Timeout | null = null;

    private tetherPayUsdtPaymentContainer: HTMLDivElement | null = null;
    private tetherPayPaymentSuccessContainer: HTMLDivElement | null = null;
    private tetherPayQRCodeContainer: HTMLDivElement | null = null;
    private tetherPayProcessingContainer: HTMLDivElement | null = null;

    private tetherPayQRCodeCanvas: HTMLCanvasElement | null = null;

    private tetherPayUSDTAmount: HTMLParagraphElement | null = null;

    private tetherPayBtnCustomPayment: HTMLButtonElement | null = null;
    private tetherPayBtnWalletPayment: HTMLButtonElement | null = null;
    private tetherPayBtnCancelWalletPayment: HTMLButtonElement | null = null;
    private tetherPayBtnEthereumPayment: HTMLButtonElement | null = null;
    private tetherPayBtnTronPayment: HTMLButtonElement | null = null;
    private tetherPayBtnSolanaPayment: HTMLButtonElement | null = null;
    private tetherPayBtnTonPayment: HTMLButtonElement | null = null;
    private tetherPayBtnAvalanchePayment: HTMLButtonElement | null = null;
    private tetherPayBtnAptosPayment: HTMLButtonElement | null = null;

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    public setTetherPayOptions(options: TetherPayOptions): void {
        this.tetherPayOptions = options;
        this.tetherPayApi = new TetherPayApi(options.baseUri);
        this.render();
        this.initializeComponents();
        this.updateUI();
        this.attachListeners();
    }

    public updateTransaction(transaction: Transaction): void {
        if (!this.tetherPayOptions) {
            throw new Error('Tether Pay not initialized.');
        }
        if (!transaction.amount || !transaction.currency) {
            throw new Error("Amount and currency are required.");
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
    }

    private showPaymentSuccess(): void {
        this.tetherPayPaymentSuccessContainer?.classList.remove('hidden');
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
        this.tetherPayBtnCustomPayment?.classList.remove('hidden');
        this.tetherPayBtnWalletPayment?.classList.remove('hidden');
    }

    private hideButtons(): void {
        this.tetherPayBtnCustomPayment?.classList.add('hidden');
        this.tetherPayBtnWalletPayment?.classList.add('hidden');
        this.tetherPayUsdtPaymentContainer?.classList.add('hidden');
    }

    private showQRCode(qrData: string, usdtAmount: number): void {
        this.tetherPayQRCodeContainer?.classList.remove('hidden');
        if (this.tetherPayUSDTAmount) {
            this.tetherPayUSDTAmount.innerText = "USDT AMOUNT " + usdtAmount;
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
        this.tetherPayPaymentSuccessContainer = this.shadowRoot?.getElementById('tetherPayPaymentSuccessContainer') as HTMLDivElement;
        this.tetherPayQRCodeContainer = this.shadowRoot?.getElementById('tetherPayQRCodeContainer') as HTMLDivElement;
        this.tetherPayProcessingContainer = this.shadowRoot?.getElementById('tetherPayProcessingContainer') as HTMLDivElement;

        this.tetherPayQRCodeCanvas = this.shadowRoot?.getElementById('tetherPayQRCodeCanvas') as HTMLCanvasElement;

        this.tetherPayUSDTAmount = this.shadowRoot?.getElementById('tetherPayUSDTAmount') as HTMLParagraphElement;

        this.tetherPayBtnCustomPayment = this.shadowRoot?.getElementById('tetherPayBtnCustomPayment') as HTMLButtonElement;
        this.tetherPayBtnWalletPayment = this.shadowRoot?.getElementById('tetherPayBtnWalletPayment') as HTMLButtonElement;
        this.tetherPayBtnCancelWalletPayment = this.shadowRoot?.getElementById('tetherPayBtnCancelWalletPayment') as HTMLButtonElement;
        this.tetherPayBtnEthereumPayment = this.shadowRoot?.getElementById('tetherPayBtnEthereumPayment') as HTMLButtonElement;
        this.tetherPayBtnTronPayment = this.shadowRoot?.getElementById('tetherPayBtnTronPayment') as HTMLButtonElement;
        this.tetherPayBtnSolanaPayment = this.shadowRoot?.getElementById('tetherPayBtnSolanaPayment') as HTMLButtonElement;
        this.tetherPayBtnTonPayment = this.shadowRoot?.getElementById('tetherPayBtnTonPayment') as HTMLButtonElement;
        this.tetherPayBtnAvalanchePayment = this.shadowRoot?.getElementById('tetherPayBtnAvalanchePayment') as HTMLButtonElement;
        this.tetherPayBtnAptosPayment = this.shadowRoot?.getElementById('tetherPayBtnAptosPayment') as HTMLButtonElement;
    }

    private updateUI(): void {
        if (!this.tetherPayOptions?.enableTetherPayAppPayment) {
            this.tetherPayBtnCustomPayment?.remove();
        }
    }

    private attachListeners(): void {
        this.tetherPayBtnCustomPayment?.addEventListener('click', (e) => {
            console.log("TODO: NOT IMPLEMENTED")
        })

        this.tetherPayBtnWalletPayment?.addEventListener('click', () => {
            this.tetherPayBtnWalletPayment?.classList.toggle('hidden');
            this.tetherPayUsdtPaymentContainer?.classList.toggle('hidden');
        });

        this.tetherPayBtnCancelWalletPayment?.addEventListener('click', () => {
            this.tetherPayBtnWalletPayment?.classList.toggle('hidden');
            this.tetherPayUsdtPaymentContainer?.classList.toggle('hidden');
        });

        this.tetherPayBtnEthereumPayment?.addEventListener('click', async () => {
            await this.createWalletTransaction("ethereum");
        });
        this.tetherPayBtnTronPayment?.addEventListener('click', async () => {
            await this.createWalletTransaction("tron");
        });
        this.tetherPayBtnSolanaPayment?.addEventListener('click', async () => {
            await this.createWalletTransaction("solana");
        })
        this.tetherPayBtnTonPayment?.addEventListener('click', async () => {
            await this.createWalletTransaction("ton");
        });
        this.tetherPayBtnAvalanchePayment?.addEventListener('click', async () => {
            await this.createWalletTransaction("avalanche");
        });
        this.tetherPayBtnAptosPayment?.addEventListener('click', async () => {
            await this.createWalletTransaction("aptos");
        });
    }

    private async createWalletTransaction(chain: string) {
        this.clearInterval();
        this.hideButtons();
        this.showProcessing();
        try {
            if (this.tetherPayOptions && this.tetherPayApi) {
                this.walletTransaction = await this.tetherPayApi.createWalletTransaction({
                    publishableKey: this.tetherPayOptions.publishableKey,
                    descriptor: this.tetherPayOptions.initialTransaction.descriptor,
                    referenceNumber: this.tetherPayOptions.initialTransaction.referenceNumber,
                    amount: this.tetherPayOptions.initialTransaction.amount,
                    currency: this.tetherPayOptions.initialTransaction.currency,
                    chain: chain,
                });
                this.showQRCode(this.walletTransaction.qrData, this.walletTransaction.usdtAmount);
                this.startListeningWalletTransaction();
                if (isMobile()) {
                    window.location.href = this.walletTransaction.qrData;
                }
            } else {
                this.loadInitialState();
                this.tetherPayOptions?.paymentFailedListener?.("Tether Pay not initialized.");
            }
        } catch (e) {
            this.loadInitialState();
            this.tetherPayOptions?.paymentFailedListener?.("Unable to create transaction");
        }
    }

    private startListeningWalletTransaction() {
        this.clearInterval();
        this.getWalletTransactionIntervalID = setInterval(async () => {
            if (this.walletTransaction?.txnID) {
                const transaction = await this.tetherPayApi?.getWalletTransaction(this.walletTransaction?.txnID);
                if (transaction?.status === WalletTransactionStatusSuccess) {
                    this.showPaymentSuccess();
                    this.clearInterval();
                }
            }
        }, 2000);
    }

    private clearInterval() {
        if (this.getWalletTransactionIntervalID) {
            clearInterval(this.getWalletTransactionIntervalID);
            this.getWalletTransactionIntervalID = null;
        }
    }
}