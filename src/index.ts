import { Listener } from './listener';
import { Poller } from './poller';
import { applyMixins } from './utils';

class Session extends Poller {}
interface Session extends Listener {}

applyMixins(Session, [Listener]);

export { Session };
export default Session;
