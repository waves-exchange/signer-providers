import { MailboxWXNListener } from './services';

export interface IUser {
    address: string;
    publicKey: string;
}

export interface IState<USER = IUser | null> {
    user: USER;
    networkByte: number;
    nodeUrl: string;
    mailboxListener: MailboxWXNListener;
}
