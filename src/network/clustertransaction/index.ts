import { Base } from '../base';
import {
  CreateTransactionRequest,
  CreateTransactionResponse,
  GetTransactionResponse,
} from '../../types';

const resourceName = 'transaction';

export class ClusterTransactions extends Base {
  async createClusterTransaction(newTransaction: CreateTransactionRequest) {
    return await this.requestCluster<CreateTransactionResponse>(`/${resourceName}`, {
      method: 'POST',
      body: JSON.stringify(newTransaction),
    });
  }

  async getClusterTransaction(transactionID: string) {
    return await this.requestCluster<GetTransactionResponse>(`/${resourceName}/${transactionID}`);
  }
}
