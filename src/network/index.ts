import { Base } from './base';
import { CryptoTransactions } from './cryptotransaction';
import { applyMixins } from './utils';
import { Config } from './config';

class ApiBase extends Base {}
applyMixins(ApiBase, [Config, CryptoTransactions]);

export type API = Base & Config & CryptoTransactions;
export const API = ApiBase as unknown as new (
  baseUri: string,
  publishableKey: string,
) => API;
