import { storage } from '../services/storage';
import { preload } from './helpers';

export interface IStorageTransferData {
    multiAccountUsers: string | null;
    multiAccountHash: string | null;
    multiAccountData: string | null;
}

export const getData = (): IStorageTransferData => {
    preload();

    return {
        multiAccountUsers: localStorage.getItem('multiAccountUsers'),
        multiAccountHash: localStorage.getItem('multiAccountHash'),
        multiAccountData: localStorage.getItem('multiAccountData'),
    };
};
