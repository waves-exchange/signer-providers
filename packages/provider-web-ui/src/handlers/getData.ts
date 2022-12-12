import { IStorageTransferData } from '@waves.exchange/provider-ui-components';

export const getData = (): IStorageTransferData => {
    return {
        multiAccountUsers: localStorage.getItem('multiAccountUsers'),
        multiAccountHash: localStorage.getItem('multiAccountHash'),
        multiAccountData: localStorage.getItem('multiAccountData'),
    };
};
