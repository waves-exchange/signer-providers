import { serializeCustomData, TDataEntry } from '@waves/waves-transactions';
import React from 'react';
import { IUserWithBalances } from '../interface';
import { IState } from '../interface';
import { SignTypedDataContainer } from '../pages/SignTypedData/SignTypedDataContainer';
import renderPage from '../utils/renderPage';
import { Required2faComponent } from '../pages/Required2fa/Required2faComponent';

export default function (
    data: Array<TDataEntry>,
    state: IState<IUserWithBalances>
): Promise<string> {
    return new Promise((resolve, reject) => {
        if (window && !(window as any).is2FAEnabled) {
            console.error('2FA must be enabled!');
            renderPage(
                React.createElement(Required2faComponent, {
                    onClose: () => {
                        reject(new Error('User rejection!'));
                    },
                })
            );

            return;
        }
        renderPage(
            React.createElement(SignTypedDataContainer, {
                networkByte: state.networkByte,
                user: state.user,
                data,
                onConfirm: async () => {
                    const bytes = serializeCustomData({
                        data,
                        version: 2,
                    });

                    const signature = await state.identity.signBytes(bytes);

                    resolve(signature);
                },
                onCancel: () => {
                    reject(new Error('User rejection!'));
                },
            })
        );
    });
}
