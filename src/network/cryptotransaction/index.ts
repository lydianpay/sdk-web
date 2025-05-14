import { Base } from '../base.js';
import {
  CreateCryptoTransactionRequest,
  CreateCryptoTransactionResponse,
  GetCryptoTransactionResponse,
  UpdateCryptoTransactionRequest,
  UpdateCryptoTransactionResponse,
} from '../../types';

const resourceName = 'transaction';

export class CryptoTransactions extends Base {
  async createCryptoTransaction(newTransaction: CreateCryptoTransactionRequest) {
    return await this.request<CreateCryptoTransactionResponse>(`/${resourceName}`, {
      method: 'POST',
      body: JSON.stringify(newTransaction),
    });
  }

  async updateCryptoTransaction(transactionID: string, updatedTransaction: UpdateCryptoTransactionRequest) {
    return await this.request<UpdateCryptoTransactionResponse>(`/${resourceName}/${transactionID}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedTransaction),
    });
  }

  async getCryptoTransaction(transactionID: string) {
    return await this.request<GetCryptoTransactionResponse>(`/${resourceName}/${transactionID}`);
  }
}
