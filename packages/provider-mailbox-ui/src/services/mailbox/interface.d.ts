export interface ICreateMsg {
    resp: 'create';
    id: number;
}

type TResp = 'success' | 'declined' | 'pk' | 'ready' | 'userData';

export interface IRawReceivedMsg {
    resp: TResp;
    value?: string;
}

// transaction send success message
export interface ITxSuccessMsg {
    resp: 'success';
    value: {
        data: any; // data that was sent in wx.network
    };
}

// transaction send decline message
export interface ITxDeclinedMsg {
    resp: 'declined';
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
    iconSrc?: string;
}

export interface IMailboxTransfer {
    type: TRANSACTION_TYPE_NUMBER.TRANSFER;
    recipient: string;
    amount: number;
    assetId?: string;
    attachment?: string;
}

interface IMailboxInvokePayment {
    assetId: string;
    amount: number;
}

interface IARGS_ENTRY {
    type: string;
    value: any;
}

export interface IMailboxInvoke {
    type: TRANSACTION_TYPE_NUMBER.SCRIPT_INVOCATION;
    payment: [IMailboxInvokePayment] | [];
    dApp: string;
    call: {
        function: string;
        args?: Array<IARGS_ENTRY>;
    } | null;
    fee?: number;
    feeAssetId?: string;
}

export interface IMailboxLease {
    type: TRANSACTION_TYPE_NUMBER.LEASE;
    amount: number;
    recipient: string;
}

export interface IMailboxCancelLease {
    type: TRANSACTION_TYPE_NUMBER.CANCEL_LEASING;
    leaseId: string;
}

export interface IMailboxSignData {
    resp: 'sign';
    data:
        | IMailboxTransfer
        | IMailboxInvoke
        | IMailboxLease
        | IMailboxCancelLease;
    meta?: IMailboxMeta;
}

export type TSendMsg = IMailboxSignData;

export type TSendSocketData = string | ArrayBufferLike | Blob | ArrayBufferView;

export interface ICreateConnectionParams {
    onOpen?: () => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (error: Event) => void;
    onCreate?: (data: ICreateMsg) => void;
    onMsg?: (data: IRawReceivedMsg) => void;
}

export interface ICreateConnectionListenersParams
    extends ICreateConnectionParams {
    onMsg?: (data: IReceivedMsg) => void;
}
