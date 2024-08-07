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
    ICreateConnectionListenersParams,
} from '../mailbox/interface';

export class MailboxWXNListener {
    protected mailbox: ConnectMailbox;
    protected _code!: string;
    protected _pair: ReturnType<typeof generateKeyPair> = Object.create(null);
    protected _wxnPK!: string;
    protected _idIconSrc!: string;
    protected _isReady = false; // соединение установлено, произошел обмен публичными ключами и подтвержден идентикон

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

    public connect(id: number, cbs: ICreateConnectionListenersParams): void {
        if (this.mailbox.isCreated) {
            return;
        }
        this.mailbox.connect(id, {
            ...cbs,
            onMsg: (data: IRawReceivedMsg): void => {
                if (typeof cbs?.onMsg !== 'function') {
                    return;
                }
                cbs.onMsg(this.decryptMessage(data));
            },
        });
    }

    public sendMsg(params: Parameters<ConnectMailbox['sendMsg']>): void {
        if (!this.mailbox.isCreated) {
            throw new Error('Connect with WX.Network');
        }

        const data = params[0] || {};

        if (data.resp === 'sign') {
            if (!this.isReady) {
                throw new Error('Connect with WX.Network');
            }
            this.mailbox.sendMsg({
                resp: data.resp,
                meta: data.meta,
                data: this.encryptMessage(data.data),
            });
        } else {
            this.mailbox.sendMsg(data);
        }
    }

    public generatePair(): void {
        this._pair = generateKeyPair();
        this.sendMsg([
            {
                resp: 'pk',
                value: this._pair.publicKey,
            },
        ]);
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
