import { libs, serializeCustomData } from '@waves/waves-transactions';
import React from 'react';
import { IUserWithBalances } from '../interface';
import { IState } from '../interface';
import { SignMessageContainer } from '../pages/SignMessage/SignMessageContainer';
import renderPage from '../utils/renderPage';
import { Required2faComponent } from '../pages/Required2fa/Required2faComponent';

export default function (
    data: string | number,
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
            React.createElement(SignMessageContainer, {
                data: String(data),
                networkByte: state.networkByte,
                user: state.user,
                onConfirm: async () => {
                    const binaryData = libs.crypto.stringToBytes(String(data));
                    const base64 =
                        'base64:' + libs.crypto.base64Encode(binaryData);
                    const bytes = serializeCustomData({
                        binary: base64,
                        version: 1,
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
