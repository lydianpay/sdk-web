import { Base } from '../base.js';
import {
  CancelTransactionRequest,
  CollectTransactionRequest,
  CreateTransactionRequest,
  CreateTransactionResponse,
  GetTransactionResponse,
} from '../../types';

const resourceName = 'transaction';

export class CryptoTransactions extends Base {
  async createCryptoTransaction(newTransaction: CreateTransactionRequest) {
    return await this.request<CreateTransactionResponse>(`/${resourceName}`, {
      method: 'POST',
      body: JSON.stringify(newTransaction),
    });
  }

  async getCryptoTransaction(transactionID: string) {
    return await this.request<GetTransactionResponse>(`/${resourceName}/${transactionID}`);
  }

  async collectCryptoTransaction(transactionID: string, collectTransaction: CollectTransactionRequest) {
    return await this.request<CreateTransactionResponse>(`/${resourceName}/${transactionID}/collect`, {
      method: 'POST',
      body: JSON.stringify(collectTransaction),
    });
  }

  async cancelCryptoTransaction(transactionID: string, cancelTransaction: CancelTransactionRequest) {
    return await this.request<CreateTransactionResponse>(`/${resourceName}/${transactionID}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify(cancelTransaction),
    });
  }
}
