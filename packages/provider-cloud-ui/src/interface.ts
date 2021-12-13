import { Long, Transaction, TransactionMap, WithId } from '@waves/ts-types';
import { MouseEventHandler } from 'react';
import { IdentityService } from './services/IdentityService';
import { IMeta } from '@waves.exchange/provider-ui-components';

export interface IUser {
    address: string;
    publicKey: string;
}

export interface IUserWithBalances extends IUser {
    username: string;
    aliases: Array<string>;
    balance: Long;
    hasScript: boolean;
}

export interface IState<USER = IUser | null> {
    user: USER;
    networkByte: number;
    nodeUrl: string;
    identity: IdentityService;
}

export interface ISignTxProps<T extends Transaction> {
    networkByte: number;
    nodeUrl: string;
    user: IUserWithBalances;
    meta: IMeta<T>;
    tx: TransactionMap<Long>[T['type']] & WithId;
    onConfirm: MouseEventHandler;
    onCancel: MouseEventHandler;
}
