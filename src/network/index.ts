import { Base } from './base';
import { CryptoTransactions } from './cryptotransaction';
import { applyMixins } from './utils';
import { Config } from './config';

class API extends Base {
}

interface API extends Config {
}

interface API extends CryptoTransactions {
}

applyMixins(API, [Config, CryptoTransactions]);

export { API };
