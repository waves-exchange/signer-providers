import { IStorageTransferData } from '../interface';

export const getData = (): IStorageTransferData => {
    return {
        multiAccountUsers: localStorage.getItem('multiAccountUsers'),
        multiAccountHash: localStorage.getItem('multiAccountHash'),
        multiAccountData: localStorage.getItem('multiAccountData'),
    };
};
