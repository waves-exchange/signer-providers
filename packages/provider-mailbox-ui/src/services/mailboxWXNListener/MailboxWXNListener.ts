import { ConnectMailbox } from '../mailbox/ConnectMailbox';
import {
    generateKeyPair,
    createIdenticonKey,
    sharedKey,
    hash,
    encrypt,
    decrypt,
} from '../../utils/mailboxUtils';
import {
    IPKMsg,
    TReceivedMsg,
    IRawReceivedMsg,
    ICreateMsg,
} from '../mailbox/interface';
import { ICallbacks } from './interface';

export class MailboxWXNListener {
    protected mailbox: ConnectMailbox;
    protected _code!: string;
    protected _pair: ReturnType<typeof generateKeyPair> = Object.create(null);
    protected _wxnPK!: string;
    protected _idIconSrc!: string;
    protected _isReady = false; // соединение установлено, произошел обмен публичными ключами и подтвержден идентикон
    protected callbacks: ICallbacks = {
        onOpen: [],
        onClose: [],
        onCreate: [],
        onError: [],
        onMsg: [],
    };

    public get idIconSrc(): string {
        return this._idIconSrc;
    }

    public get code(): string {
        return this._code;
    }

    public get isReady(): boolean {
        return this._isReady;
    }

    constructor() {
        this.mailbox = new ConnectMailbox();
    }

    public connect(id: number): void {
        if (this.mailbox.isCreated) {
            return;
        }

        this.mailbox.connect(id, {
            onOpen: () => {
                this.callbacks.onOpen.forEach((cb) => {
                    if (typeof cb === 'function') {
                        cb();
                    }
                });
            },
            onCreate: (data: ICreateMsg) => {
                this.callbacks.onCreate.forEach((cb) => {
                    if (typeof cb === 'function') {
                        cb(data);
                    }
                });
            },
            onClose: (data: CloseEvent) => {
                this.callbacks.onClose.forEach((cb) => {
                    if (typeof cb === 'function') {
                        cb(data);
                    }
                });
            },
            onError: (data: Event) => {
                this.callbacks.onError.forEach((cb) => {
                    if (typeof cb === 'function') {
                        cb(data);
                    }
                });
            },
            onMsg: (data: IRawReceivedMsg): void => {
                this.callbacks.onMsg.forEach((cb) => {
                    if (typeof cb === 'function') {
                        cb(this.decryptMessage(data));
                    }
                });
            },
        });
    }

    public sendMsg(params: Parameters<ConnectMailbox['sendMsg']>[0]): void {
        if (!this.mailbox.isCreated) {
            throw new Error('Connect with WX.Network');
        }

        const data = params;

        if (data.resp === 'sign' || data.resp === 'signMessage') {
            if (!this.isReady) {
                throw new Error('Connect with WX.Network');
            }
            this.mailbox.sendMsg({
                resp: data.resp,
                meta: data.meta,
                data: this.encryptMessage(data.data),
                msgId: data.msgId,
            });
        } else {
            this.mailbox.sendMsg(data);
        }
    }

    public generatePair(): void {
        this._pair = generateKeyPair();
        this.sendMsg({
            resp: 'pk',
            value: this._pair.publicKey,
        });
    }

    public onGetWXNPk(params: IPKMsg): void {
        this.setWXNPk(params);
        this.createIdenticon();
    }

    public setCode(code: string): void {
        this._code = code;
    }

    public setConnectionIsReady(): void {
        this.setIsReady(true);
    }

    public setNetwork(networkByte?: number): void {
        this.mailbox.setUrl(networkByte);
    }

    public addCb<T extends keyof ICallbacks>(
        type: T,
        cb: ICallbacks[T][0]
    ): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.callbacks[type].push(cb);
    }

    public removeCb<T extends keyof ICallbacks>(
        type: T,
        cb: ICallbacks[T][0]
    ): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.callbacks[type] = this.callbacks[type].filter((_cb) => _cb !== cb);
    }

    protected createIdenticon(): void {
        this.setIdIconSrc(
            createIdenticonKey(
                hash(sharedKey(this._pair.privateKey, this._wxnPK, this.code))
            )
        );
    }

    protected setWXNPk(params: IPKMsg): void {
        this._wxnPK = params.value;
    }

    protected setIdIconSrc(src: string): void {
        this._idIconSrc = src;
    }

    protected setIsReady(isReady: boolean): void {
        this._isReady = isReady;
    }

    protected decryptMessage(message: IRawReceivedMsg): TReceivedMsg {
        switch (message.resp) {
            case 'declined':
            case 'success':
            case 'userData':
                return {
                    ...message,
                    value: decrypt({
                        privateKey: this._pair.privateKey,
                        publicKey: this._wxnPK,
                        code: this._code,
                        value: message?.value || '',
                    }),
                } as TReceivedMsg;
            case 'pk':
            case 'ready':
            default:
                return message as TReceivedMsg;
        }
    }

    protected encryptMessage(value: any): string {
        return encrypt({
            privateKey: this._pair.privateKey,
            publicKey: this._wxnPK,
            code: this._code,
            value: value,
        });
    }
}
