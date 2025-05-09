import tetherPayCSS from './tetherpay.generated.css?inline';
import checkoutTemplate from './checkout-template.html?raw';
import {TetherPayOptions} from "../types";
import QrCode from 'qrcode';
import {QRCodeDefaults} from "../constants";

export class TetherPayCheckout extends HTMLElement {
    private shadow: ShadowRoot;
    private tetherPayOptions: TetherPayOptions | null = null;

    private tetherPayUsdtPaymentContainer: HTMLDivElement | null = null;
    private tetherPayPaymentSuccessContainer: HTMLDivElement | null = null;
    private tetherPayQRCodeContainer: HTMLDivElement | null = null;
    private tetherPayProcessingContainer: HTMLDivElement | null = null;

    private tetherPayQRCodeCanvas: HTMLCanvasElement | null = null;

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
        this.render();
        this.initializeComponents();
        this.updateUI();
        this.attachListeners();
    }

    public displayPaymentSuccess(): void {
        this.hideButtons();
        this.hideQRCode();
        this.hideProcessing();
        this.tetherPayPaymentSuccessContainer?.classList.remove('hidden');
    }

    public displayProcessing(): void {
        this.tetherPayProcessingContainer?.classList.remove('hidden');
    }

    public hideProcessing(): void {
        this.tetherPayProcessingContainer?.classList.add('hidden');
    }

    public displayButtons(): void {
        this.tetherPayBtnCustomPayment?.classList.remove('hidden');
        this.tetherPayBtnWalletPayment?.classList.remove('hidden');
    }

    public hideButtons(): void {
        this.tetherPayBtnCustomPayment?.classList.add('hidden');
        this.tetherPayBtnWalletPayment?.classList.add('hidden');
        this.tetherPayUsdtPaymentContainer?.classList.add('hidden');
    }

    public displayQRCode(qrData: string): void {
        this.tetherPayQRCodeContainer?.classList.remove('hidden');
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

    public hideQRCode(): void {
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
            if (this.tetherPayOptions?.handleTetherPayAppButtonClick) {
                this.tetherPayOptions.handleTetherPayAppButtonClick();
                this.hideButtons();
                this.displayProcessing();
            }
        })

        this.tetherPayBtnWalletPayment?.addEventListener('click', () => {
            this.tetherPayBtnWalletPayment?.classList.toggle('hidden');
            this.tetherPayUsdtPaymentContainer?.classList.toggle('hidden');
        });

        this.tetherPayBtnCancelWalletPayment?.addEventListener('click', () => {
            this.tetherPayBtnWalletPayment?.classList.toggle('hidden');
            this.tetherPayUsdtPaymentContainer?.classList.toggle('hidden');
        });

        this.tetherPayBtnEthereumPayment?.addEventListener('click', () => {
            this.tetherPayOptions?.handleTetherPayWalletButtonClick("ethereum");
            this.hideButtons();
            this.displayProcessing();
        });
        this.tetherPayBtnTronPayment?.addEventListener('click', () => {
            this.tetherPayOptions?.handleTetherPayWalletButtonClick("tron");
            this.hideButtons();
            this.displayProcessing();
        });
        this.tetherPayBtnSolanaPayment?.addEventListener('click', () => {
            this.tetherPayOptions?.handleTetherPayWalletButtonClick("solana");
            this.hideButtons();
            this.displayProcessing();
        })
        this.tetherPayBtnTonPayment?.addEventListener('click', () => {
            this.tetherPayOptions?.handleTetherPayWalletButtonClick("ton");
            this.hideButtons();
            this.displayProcessing();
        });
        this.tetherPayBtnAvalanchePayment?.addEventListener('click', () => {
            this.tetherPayOptions?.handleTetherPayWalletButtonClick("avalanche");
            this.hideButtons();
            this.displayProcessing();
        });
        this.tetherPayBtnAptosPayment?.addEventListener('click', () => {
            this.tetherPayOptions?.handleTetherPayWalletButtonClick("aptos");
            this.hideButtons();
            this.displayProcessing();
        });
    }
}