export type TetherPayOptions = {
    enableTetherPayAppPayment: boolean;
    handleTetherPayAppButtonClick: () => void;
    handleTetherPayWalletButtonClick: (chain: string) => void;
};
