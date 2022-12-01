import { Long, Transaction, TransactionMap, WithId } from '@waves/ts-types';
import { MouseEventHandler } from 'react';
import { IMeta } from '@waves.exchange/provider-ui-components';
import { IStorageTransferData } from './handlers/getData';

export interface IState<USER = IUser | null> {
    user: USER;
    networkByte: number;
    nodeUrl: string;
    matcherUrl?: string | undefined;
    publicUserData?: IStorageTransferData;
}

export type TPrivateMultiaccountData = Record<string, TPrivateUserData>;

type TPrivateUserData =
    | IPrivateSeedUserData
    | IPrivateKeeperUserData
    | IPrivateLedgerUserData
    | IPrivateKeyUserData;

export interface IPrivateUserDataBase {
    networkByte: number;
    publicKey: string;
}

export interface IPrivateSeedUserData extends IPrivateUserDataBase {
    seed: string;
    userType: 'seed';
}

export interface IPrivateKeeperUserData extends IPrivateUserDataBase {
    userType: 'keeper';
}

export interface IPrivateLedgerUserData extends IPrivateUserDataBase {
    userType: 'ledger';
}

export interface IPrivateKeyUserData extends IPrivateUserDataBase {
    userType: 'privateKey';
    privateKey: string;
}

export interface IUserStorageInfo {
    lastLogin: number;
    name: string;
    settings?: Record<string, Partial<IUserSettings>>;
    matcherSign?: any;
}

export interface IUserSettings {
    hasBackup: boolean;
    pinnedAssetIdList: Array<string>;
}

export interface ISignTxProps<T extends Transaction> {
    networkByte: number;
    nodeUrl: string;
    user: Omit<IUserWithBalances, 'seed'> & { publicKey: string };
    meta: IMeta<T>;
    tx: TransactionMap<Long>[T['type']] & WithId;
    onConfirm: MouseEventHandler;
    onCancel: MouseEventHandler;
}

export interface IUser {
    address: string;
    privateKey: string;
}

export interface IUserWithBalances extends IUser {
    aliases: Array<string>;
    balance: Long;
    hasScript: boolean;
}
