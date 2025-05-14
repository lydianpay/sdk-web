import { Base } from './base';
import { CryptoTransactions } from './cryptotransaction';
import { applyMixins } from './utils';
import { Config } from './config';
import { ClusterTransactions } from './clustertransaction';

class TetherPayApi extends Base {
}

interface TetherPayApi extends Config {
}

interface TetherPayApi extends CryptoTransactions {
}

interface TetherPayApi extends ClusterTransactions {
}

applyMixins(TetherPayApi, [Config, CryptoTransactions, ClusterTransactions]);

export { TetherPayApi };
