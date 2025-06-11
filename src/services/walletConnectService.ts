import Client, { SignClient } from "@walletconnect/sign-client";
import { SessionTypes } from "@walletconnect/types";
import { walletConnectProjectId } from "../constants";
import { EthereumTransactionParams } from "../types/ethereum";

export interface WalletConnectServiceProps {
    shadow: ShadowRoot;
}

export class WalletConnectService {
    private shadow: ShadowRoot;
    private client: Client | undefined;
    private session: SessionTypes.Struct | undefined;

    constructor({
        shadow
    }: WalletConnectServiceProps) {
        this.shadow = shadow;
    }

    get currentSession() {
        return this.session;
    }

    set currentSession(session: SessionTypes.Struct | undefined) {
        this.session = session;
    }

    private restoreLastSession() {
        if (!this.client) {
            throw new Error('wallet connect client not initialized');
        }
        console.log('all sessions', this.client.session.getAll());
        const lastSession = this.client.session.getAll().pop();
        console.log('lastSession', lastSession);

        return lastSession;
    }

    public async init() {
        this.client = await SignClient.init({ projectId: walletConnectProjectId });
        this.session = this.restoreLastSession();

        this.client.on("session_event", (event) => {
            // Handle session events, such as "chainChanged", "accountsChanged", etc.
            console.log('session event', event);
        });

        this.client.on("session_update", ({ topic, params }) => {
            const { namespaces } = params;
            const _session = this.client?.session.get(topic);
            // Overwrite the `namespaces` of the existing session with the incoming one.
            const updatedSession = { ..._session, namespaces };
            // Integrate the updated session state into your dapp state.
            //   onSessionUpdate(updatedSession);
            console.log('session updated:', updatedSession);
        });

        this.client.on("session_delete", (event) => {
            // Session was deleted -> reset the dapp state, clean up from user session, etc.
            console.log('session deleted:', event);
        });
    }

    public async connectWalletWithQrCode() {
        if (!this.client) {
            throw new Error('wallet connect client not initialized');
        }

        const { uri, approval } = await this.client.connect({
            requiredNamespaces: {
                eip155: {
                    methods: [
                        "eth_sendTransaction",
                        "eth_signTransaction",
                        "eth_sign",
                        "personal_sign",
                        "eth_signTypedData"
                    ],
                    chains: [
                        "eip155:1"
                    ],
                    events: ["chainChanged", "accountsChanged"],
                },
            },
        });
        console.log("Connect with URI:", uri);

        return { uri, approval };
    }

    public async sendEthTransaction(transaction: EthereumTransactionParams) {
        if (!this.client) {
            throw new Error('wallet connect client not initialized');
        }
        if (!this.session) {
            throw new Error('wallet connect session not initialized');
        }

        console.log('sending eth_sendTransaction request');

        const result = await this.client.request({
            chainId: "eip155:1",
            topic: this.session.topic,
            request: {
                method: "eth_sendTransaction",
                params: [transaction],
            },
        });
        console.log('result:', result);

        return result;
    }
}