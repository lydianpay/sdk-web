import { Base } from '../base';
import {
  CreateCryptoTransactionRequest,
  CreateCryptoTransactionResponse,
  GetCryptoTransactionResponse,
} from '../../types';

const resourceName = 'transaction';

export class ClusterTransactions extends Base {
  async createClusterTransaction(newTransaction: CreateCryptoTransactionRequest) {
    return await this.requestCluster<CreateCryptoTransactionResponse>(`/${resourceName}`, {
      method: 'POST',
      body: JSON.stringify(newTransaction),
    });
  }

  async getClusterTransaction(transactionID: string) {
    return await this.requestCluster<GetCryptoTransactionResponse>(`/${resourceName}/${transactionID}`);
  }
}
