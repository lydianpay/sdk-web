import { SessionResponse } from './types';
import { Poller, PollerParams } from './poller';
import {
  pollingIntervalInMilliseconds,
  QRCodeDefaults,
  QRCodeTextProtocol,
  TransactionResponseStatus,
} from './constants';
import QrCode from 'qrcode';

export type ListenerParams = {
  sessionUUID: string;
  socketUrl?: string;
};

export type ListenParams = {
  onConfirm: (data: SessionResponse) => void;
  onReject: (data: SessionResponse) => void;
  onError: (error: any) => void;
};

export abstract class Listener extends Poller {
  private sessionUUID: string;
  private poller: NodeJS.Timeout;

  constructor(config: PollerParams) {
    super(config);

    this.sessionUUID = config.sessionUUID;
  }

  public listen({ onConfirm, onReject, onError }: ListenParams) {
    if (this.poller) {
      throw new Error('socket already open');
    }
    this.poller = setInterval(async () => {
      try {
        const data = await this.poll();
        if (Object.values(TransactionResponseStatus).includes(data?.status)) {
          this.close();
        }
        if (data?.status === TransactionResponseStatus.CONFIRMED) {
          onConfirm(data);
        }
        if (data?.status === TransactionResponseStatus.REJECTED) {
          onReject(data);
        }
      } catch (error) {
        this.close();
        onError(error);
      }
    }, pollingIntervalInMilliseconds);
  }

  close() {
    if (this.poller) {
      clearInterval(this.poller);
    }
  }

  renderQrCode(elementId: string = 'tpg-payment-code') {
    const sessionUUID = this.sessionUUID;

    const paymentCodeContainer = document.getElementById(elementId);
    if (!paymentCodeContainer) {
      console.error(`cannot find element with id ${elementId}`);
      return;
    }

    const paymentCodeElem = document.createElement('canvas');
    QrCode.toDataURL(paymentCodeElem, `${QRCodeTextProtocol}${sessionUUID}`, QRCodeDefaults);

    paymentCodeContainer.appendChild(paymentCodeElem);
  }
}
