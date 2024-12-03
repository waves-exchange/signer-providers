import { ICreateConnectionParams, TSendSocketData } from './interface';

const MAINNET_WS_URL = 'wss://ws.wx.network/api/v1/mailbox';
const TESTNET_WS_URL = 'wss://ws-testnet.wx.network/api/v1/mailbox';

export abstract class Mailbox {
    protected socket: WebSocket | undefined;
    protected url!: string;
    protected _isOpen: boolean;
    protected _isCreated: boolean;
    protected _error: Event | undefined;

    public get isOpen(): boolean {
        return this._isOpen;
    }

    public get isCreated(): boolean {
        return this._isCreated;
    }

    public get error(): Event | undefined {
        return this._error;
    }

    constructor() {
        this._isOpen = false;
        this._isCreated = false;
    }

    public setUrl(networkByte?: number): void {
        this.url = networkByte === 84 ? TESTNET_WS_URL : MAINNET_WS_URL;
    }

    public createConnection(cbParams?: ICreateConnectionParams): void {
        if (!this.url) {
            this.setUrl();
        }
        this.socket = new WebSocket(this.url);
        this.socket.onopen = (): void => {
            this._isOpen = true;
            if (typeof cbParams?.onOpen === 'function') {
                cbParams.onOpen();
            }
        };
        this.socket.onmessage = (event: MessageEvent): void => {
            this.onReceiveMsg(event, cbParams?.onCreate, cbParams?.onMsg);
        };
        this.socket.onclose = (event: CloseEvent): void => {
            this.onClose(event, cbParams?.onClose);
        };
        this.socket.onerror = (error: Event): void => {
            this.onError(error, cbParams?.onError);
        };
    }

    public sendMsg(data: any): void {
        return this.send(JSON.stringify(data));
    }

    public send(data: TSendSocketData): void {
        if (!this.socket) {
            return;
        }
        this.socket.send(data);
    }

    public close(): void {
        if (!this.socket) {
            return;
        }
        this.socket.close();
        this._isOpen = false;
        this._isCreated = false;
        this._error = undefined;
        this.socket = undefined;
    }

    protected sendCreateMsg(): void {
        this.send(JSON.stringify({ req: 'create' }));
    }

    protected sendConnectMsg(id: number): void {
        this.send(JSON.stringify({ req: 'connect', id }));
    }

    protected onReceiveMsg(
        event: MessageEvent,
        createCb?: ICreateConnectionParams['onCreate'],
        msgCb?: ICreateConnectionParams['onMsg']
    ): void {
        let data;

        try {
            data = JSON.parse(event.data);
        } catch (e) {
            data = event.data;
        }

        if (data?.resp === 'created' || data?.resp === 'connected') {
            this._isCreated = true;
            if (typeof createCb === 'function') {
                createCb({
                    resp: data.resp,
                    id: data.id,
                });
            }
        } else if (typeof msgCb === 'function') {
            msgCb(data);
        }
    }

    protected onClose(
        event: CloseEvent,
        closeCb?: ICreateConnectionParams['onClose']
    ): void {
        this._isOpen = false;
        this._isCreated = false;
        if (typeof closeCb === 'function') {
            closeCb(event);
        }
    }

    protected onError(
        event: Event,
        errorCb?: ICreateConnectionParams['onError']
    ): void {
        this._error = event;
        if (typeof errorCb === 'function') {
            errorCb(event);
        }
    }
}
