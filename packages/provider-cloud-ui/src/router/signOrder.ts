import { SignedTx, SignerTx } from '@waves/signer';
import { IOrderParams } from '@waves/waves-transactions';
import React from 'react';
import { IUserWithBalances } from '../interface';
import { IState } from '../interface';
import renderPage from '../utils/renderPage';
import { prepareOrder } from '../services/prepareOrder';
import { SignOrderContainer } from '../pages/SignOrder/SignOrderContainer';

export default function (
    orderParams: IOrderParams,
    state: IState<IUserWithBalances>
): Promise<Array<SignedTx<SignerTx>>> {
    return prepareOrder(state, orderParams).then(
        ({ assetsHash, ...orderParams }) => {
            return new Promise<any>((resolve, reject) => {
                renderPage(
                    React.createElement(SignOrderContainer, {
                        order: orderParams,
                        assetsHash,
                        user: state.user,
                        onConfirm: async () => {
                            try {
                                const signedOrder = await state.identity.signOrder(
                                    orderParams
                                );

                                resolve(signedOrder);
                            } catch (e) {
                                reject(e);
                            }
                        },
                        onCancel: () => {
                            reject(new Error('User rejection!'));
                        },
                    })
                );
            });
        }
    );
}
