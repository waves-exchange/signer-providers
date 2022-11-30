import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { TFeeInfo } from '@waves/node-api-js/es/api-node/transactions';
import { NAME_MAP } from '@waves/node-api-js/es/constants';
import {
    ConnectOptions,
    SignedTx,
    SignerLeaseTx,
    SignerTx,
    TypedData,
    UserData,
} from '@waves/signer';
import {
    Long,
    Transaction,
    TransactionMap,
    WithApiMixin,
    WithId,
    MassTransferTransaction,
    TransferTransaction,
} from '@waves/ts-types';
import { Bus } from '@waves/waves-browser-bus';

export type DetailsWithLogo = TAssetDetails<Long> & {
    logo?: string;
};

export type InfoMap = {
    1: void;
    2: void;
    [NAME_MAP.issue]: void;
    [NAME_MAP.transfer]: void;
    [NAME_MAP.reissue]: void;
    [NAME_MAP.burn]: void;
    [NAME_MAP.exchange]: void;
    [NAME_MAP.lease]: void;
    [NAME_MAP.cancelLease]: SignerLeaseTx & WithApiMixin;
    [NAME_MAP.alias]: void;
    [NAME_MAP.massTransfer]: void;
    [NAME_MAP.data]: void;
    [NAME_MAP.setScript]: void;
    [NAME_MAP.sponsorship]: void;
    [NAME_MAP.setAssetScript]: void;
    [NAME_MAP.invoke]: void;
    17: void;
};

export interface IMeta<T extends Transaction> {
    feeList: Array<TFeeInfo>;
    aliases: Record<string, string>;
    assets: Record<string, DetailsWithLogo>;
    params: T;
    info: InfoMap[T['type']];
}

export interface ITransactionInfo<T extends Transaction> {
    meta: IMeta<T>;
    tx: TransactionMap<Long>[T['type']] & WithId;
}

export type TransferType = TransferTransaction | MassTransferTransaction;
export type TransferMeta = IMeta<TransferType>;

export interface IPayment {
    assetId: string | null;
    name: string;
    amount: Long;
    logo?: string;
    decimals: number;
}

export type TBusHandlers = {
    login: (data?: void) => Promise<UserData>;

    'sign-custom-bytes': (data: string) => Promise<string>;
    'sign-message': (data: string | number) => Promise<string>;
    'sign-typed-data': (data: Array<TypedData>) => Promise<string>;

    sign<T extends Array<SignerTx>>(
        list: T
    ): Promise<{ [Key in keyof T]: SignedTx<T[Key]> }>;
};

export interface IBusEvents {
    connect: ConnectOptions;
    close: void;
    ready: void;
    transferStorage: any;
}

export type TBus = Bus<IBusEvents, TBusHandlers>;

export interface IQueueItem {
    action: () => Promise<void>;
    reject: (error: Error) => void;
}

export interface IQueue {
    length: number;
    push<T>(action: () => Promise<T>): Promise<T>;
    canPush(): boolean;
    clear(error?: Error | string): void;
}
