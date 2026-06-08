import { Base } from '../base.js';
import {
  CancelTransactionRequest,
  CreatePaymentRequest,
  CreateTransactionRequest,
  CreateTransactionResponse,
  GetTransactionResponse,
  KYCVerificationRequest,
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

  async createPaymentRequest(transactionID: string, paymentRequest: CreatePaymentRequest) {
    return await this.request<CreateTransactionResponse>(`/${resourceName}/${transactionID}/payment`, {
      method: 'POST',
      body: JSON.stringify(paymentRequest),
    });
  }

  async cancelCryptoTransaction(transactionID: string, cancelTransaction: CancelTransactionRequest) {
    return await this.request<CreateTransactionResponse>(`/${resourceName}/${transactionID}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify(cancelTransaction),
    });
  }

  async kycVerification(transactionID: string, kycVerificationRequest: KYCVerificationRequest) {
    const formData = new FormData();
    formData.append('asset', kycVerificationRequest.asset);
    formData.append('network', kycVerificationRequest.network);
    formData.append('firstName', kycVerificationRequest.firstName);
    formData.append('lastName', kycVerificationRequest.lastName);
    formData.append('email', kycVerificationRequest.email);
    formData.append('street', kycVerificationRequest.street);
    formData.append('city', kycVerificationRequest.city);
    formData.append('region', kycVerificationRequest.region);
    formData.append('postalCode', kycVerificationRequest.postalCode);
    formData.append('country', kycVerificationRequest.country);
    if (kycVerificationRequest.documentType) {
      formData.append('documentType', kycVerificationRequest.documentType);
    }
    for (const file of kycVerificationRequest.documentFiles) {
      formData.append('documentFiles', file);
    }

    return await this.requestWithFormData<CreateTransactionResponse>(`/${resourceName}/${transactionID}/verification`, {
      method: 'POST',
      body: formData,
    });
  }
}
