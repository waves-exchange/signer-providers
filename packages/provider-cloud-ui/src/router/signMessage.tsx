import { libs, serializeCustomData } from '@waves/waves-transactions';
import React from 'react';
import { IUserWithBalances } from '../interface';
import { IState } from '../interface';
import { SignMessageContainer } from '../pages/SignMessage/SignMessageContainer';
import renderPage from '../utils/renderPage';

export default function (
    data: string | number,
    state: IState<IUserWithBalances>
): Promise<string> {
    return new Promise((resolve, reject) => {
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
