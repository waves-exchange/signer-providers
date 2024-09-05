import { SignerTx } from '@waves/signer';

export interface ICreateMsg {
    resp: 'create';
    id: number;
}

type TResp = 'success' | 'declined' | 'pk' | 'ready' | 'userData';

export interface IRawReceivedMsg {
    resp: TResp;
    value?: string;
}

// transaction sign success message
export interface ITxSuccessMsg {
    resp: 'success';
    msgId: string;
    value: {
        data: any; // signed data that was sent in wx.network
    };
}

// transaction sign decline message
export interface ITxDeclinedMsg {
    resp: 'declined';
    msgId: string;
    value: {
        data: any; // data that was sent in wx.network
        error?: any;
    };
}

// public key
export interface IPKMsg {
    resp: 'pk';
    value: string;
}

export interface IReadyMsg {
    resp: 'ready';
}

export interface IUserDataMsg {
    resp: 'userData';
    value: {
        address: string;
        publicKey: string;
        name?: string;
        isSignAndBroadcastByProvider?: boolean;
    };
}

export type TReceivedMsg =
    | IPKMsg
    | ITxSuccessMsg
    | ITxDeclinedMsg
    | IReadyMsg
    | IUserDataMsg;

export interface IMailboxMeta {
    userAddress?: string; // user address in multiacc
    referrer?: string; // source
    referrerName?: string; // source name
    iconSrc?: string;
}

interface IMailboxBaseSign {
    resp: 'sign' | 'signMessage';
    msgId: string;
    meta?: IMailboxMeta;
}

export interface IMailboxSignData extends IMailboxBaseSign {
    resp: 'sign';
    data: Array<SignerTx> | SignerTx;
}

export interface IMailboxSignMessage extends IMailboxBaseSign {
    resp: 'signMessage';
    data: string;
}

export type TSendMsg = IMailboxSignData | IMailboxSignMessage;

export type TSendSocketData = string | ArrayBufferLike | Blob | ArrayBufferView;

export interface ICreateConnectionParams {
    onOpen?: () => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (error: Event) => void;
    onCreate?: (data: ICreateMsg) => void;
    onMsg?: (data: IRawReceivedMsg) => void;
}
