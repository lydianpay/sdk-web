import { Base } from './base';
import { CryptoTransactions } from './cryptotransaction';
import { applyMixins } from './utils';
import { Config } from './config';
import { ClusterTransactions } from './clustertransaction';

class API extends Base {
}

interface API extends Config {
}

interface API extends CryptoTransactions {
}

interface API extends ClusterTransactions {
}

applyMixins(API, [Config, CryptoTransactions, ClusterTransactions]);

export { API };
