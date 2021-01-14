import {
    IConnectOptions,
    ITypedData,
    IUserData,
    TLong,
    TTransactionParamWithType,
} from '@waves/signer';
import {
    ILeaseTransaction,
    IWithApiMixin,
    IWithId,
    TTransactionMap,
    TTransactionWithProofs,
} from '@waves/ts-types';
import { NAME_MAP } from '@waves/node-api-js/es/constants';
import { MouseEventHandler } from 'react';
import { TFeeInfo } from '@waves/node-api-js/es/api-node/transactions';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TBusHandlers = {
    login: (data?: void) => Promise<IUserData>;

    'sign-custom-bytes': (data: string) => Promise<string>;
    'sign-message': (data: string | number) => Promise<string>;
    'sign-typed-data': (data: Array<ITypedData>) => Promise<string>;

    sign(
        list: Array<TTransactionParamWithType>
    ): Promise<Array<TTransactionWithProofs<TLong> & IWithId>>;
};

export interface IEncryptedUserData {
    publicKey: string;
    encrypted: string;
}

export interface IBusEvents {
    connect: IConnectOptions;
    close: void;
    ready: void;
}

export type DetailsWithLogo = TAssetDetails<TLong> & {
    logo?: string;
};

export type InfoMap = {
    [NAME_MAP.issue]: void;
    [NAME_MAP.transfer]: void;
    [NAME_MAP.reissue]: void;
    [NAME_MAP.burn]: void;
    [NAME_MAP.exchange]: void;
    [NAME_MAP.lease]: void;
    [NAME_MAP.cancelLease]: ILeaseTransaction<TLong> & IWithApiMixin;
    [NAME_MAP.alias]: void;
    [NAME_MAP.massTransfer]: void;
    [NAME_MAP.data]: void;
    [NAME_MAP.setScript]: void;
    [NAME_MAP.sponsorship]: void;
    [NAME_MAP.setAssetScript]: void;
    [NAME_MAP.invoke]: void;
};

export interface IMeta<T extends TTransactionParamWithType> {
    feeList: Array<TFeeInfo>;
    aliases: Record<string, string>;
    assets: Record<string, DetailsWithLogo>;
    params: T;
    info: InfoMap[T['type']];
}

export interface ITransactionInfo<T extends TTransactionParamWithType> {
    meta: IMeta<T>;
    tx: TTransactionMap<TLong>[T['type']] & IWithId;
}

export interface ISignTxProps<T extends TTransactionParamWithType> {
    networkByte: number;
    nodeUrl: string;
    user: Omit<IUserWithBalances, 'seed'> & { publicKey: string };
    meta: IMeta<T>;
    tx: TTransactionMap<TLong>[T['type']] & IWithId;
    onConfirm: MouseEventHandler;
    onCancel: MouseEventHandler;
}

export interface IUser {
    address: string;
    privateKey: string;
}

export interface IUserWithBalances extends IUser {
    aliases: Array<string>;
    balance: TLong;
    hasScript: boolean;
}

// eslint-disable-next-line prettier/prettier
export type TFunction<Params extends Array<unknown>, Return> = (
    ...args: Params
) => Return;

export interface IKeyPair {
    privateKey: string;
    publicKey: string;
}

export type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? RecursivePartial<U>[]
        : T[P] extends object
        ? RecursivePartial<T[P]>
        : T[P];
};
