import { Listener } from './listener';
import { Poller } from './poller';
import { applyMixins } from './utils';

class Session extends Poller {}
interface Session extends Listener {}

// TODO: does this need to be refactored to handle
// sessions and transactions?

applyMixins(Session, [Listener]);

export { Session };
export default Session;
