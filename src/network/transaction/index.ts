import {Base} from '../base.js';
import {CreateWalletTransactionRequest, CreateWalletTransactionResponse, TetherPayOptions} from '../../types';

const resourceName = 'transaction';

export class Transactions extends Base {
    async createWalletTransaction(newTransaction: CreateWalletTransactionRequest) {
        return await this.request<CreateWalletTransactionResponse>(`/${resourceName}`, {
            method: 'POST',
            body: JSON.stringify(newTransaction),
        });
    }
}
