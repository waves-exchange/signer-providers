import { preload } from './helpers';

export interface IStorageTransferData {
    multiAccountUsers: string | null;
}

export const getData = (): IStorageTransferData => {
    preload();

    return {
        multiAccountUsers: localStorage.getItem('multiAccountUsers'),
    };
};
