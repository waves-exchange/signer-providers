export interface IStorageTransferData {
    multiAccountUsers: string | null;
    multiAccountHash: string | null;
    multiAccountData: string | null;
}

export const getData = (): IStorageTransferData => {
    return {
        multiAccountUsers: localStorage.getItem('multiAccountUsers'),
        multiAccountData: localStorage.getItem('multiAccountData'),
        multiAccountHash: localStorage.getItem('multiAccountHash'),
    };
};
