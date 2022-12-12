import { Bus, WindowAdapter } from '@waves/waves-browser-bus';

export interface IStorageTransferData {
    multiAccountUsers: string | null;
    multiAccountHash: string | null;
    multiAccountData: string | null;
}

export const transferStorage = (win: Window): Promise<IStorageTransferData> => {
    return WindowAdapter.createSimpleWindowAdapter(win, {
        origins: ['*'],
    }).then((adapter) => {
        return new Promise<IStorageTransferData>((resolve) => {
            const _bus = new Bus(adapter, -1);

            _bus.once('ready', () => {
                _bus.once('transferStorage', (data) => {
                    win.close();
                    adapter.destroy();
                    resolve(data);
                });
            });
        });
    });
};
