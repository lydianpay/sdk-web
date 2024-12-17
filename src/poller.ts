import { SessionResponse } from './types';

export type PollerParams = {
  sessionUUID: string;
  socketUrl?: string;
};

export abstract class Poller {
  protected sessionUUID: string;
  protected socketUrl: string;

  constructor(config: PollerParams) {
    this.sessionUUID = config.sessionUUID;
    this.socketUrl = config.socketUrl || 'http://example.com';
  }

  // TODO: consider using {'Connection': 'keep-alive'} for a persistent connection
  // we wouldn't need to keep it open for longer than a minute at a time and chances
  // are that the customer will confirm the transactions within the first minute or two

  protected async poll(resource: string = '/session') {
    const url = `${this.socketUrl}${resource}/${this.sessionUUID}`;
    const response = await fetch(url);

    if (response.ok) {
      try {
        const data = await response.json();
        return data as SessionResponse;
      } catch (error) {
        return null;
      }
    }

    throw new Error(response.statusText);
  }
}
