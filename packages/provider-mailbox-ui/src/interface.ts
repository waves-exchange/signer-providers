import { MailboxWXNListener } from './services';
import { Long, Transaction, TransactionMap, WithId } from '@waves/ts-types';
import { MouseEventHandler } from 'react';
import { IMeta } from '@waves.exchange/provider-ui-components';

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
    publicKey: string;
    name: string;
}

export interface IState<USER = IUser | null> {
    user: USER;
    networkByte: number;
    nodeUrl: string;
    mailboxListener: MailboxWXNListener;
}

export interface IUserWithBalances extends IUser {
    aliases: Array<string>;
    balance: Long;
    hasScript: boolean;
}
