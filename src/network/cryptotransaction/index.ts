import { Base } from '../base.js';
import {
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
}
