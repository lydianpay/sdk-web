import {Base} from "./base";
import {Transactions} from "./transaction";
import {applyMixins} from "./utils";

class TetherPayApi extends Base {
}

interface TetherPayApi extends Transactions {
}

applyMixins(TetherPayApi, [Transactions]);

export {TetherPayApi};
