import {Base} from '../base.js';
import {
    CreateWalletTransactionRequest,
    CreateWalletTransactionResponse,
    GetWalletTransactionResponse,
    TetherPayOptions
} from '../../types';

const resourceName = 'transaction';

export class Transactions extends Base {
    async createWalletTransaction(newTransaction: CreateWalletTransactionRequest) {
        return await this.request<CreateWalletTransactionResponse>(`/${resourceName}`, {
            method: 'POST',
            body: JSON.stringify(newTransaction),
        });
    }
    async getWalletTransaction(transactionID: string) {
        return await this.request<GetWalletTransactionResponse>(`/${resourceName}/${transactionID}`);
    }
}
