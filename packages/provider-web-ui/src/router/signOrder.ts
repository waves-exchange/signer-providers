import { libs, order } from '@waves/waves-transactions';
import React from 'react';
import { IUserWithBalances } from '../interface';
import { IState } from '../interface';
import renderPage from '../utils/renderPage';
import { prepareOrder } from '../services/prepareOrder';
import { SignOrderContainer } from '../pages/SignOrder/SignOrderContainer';
import { TOrderArgs } from '@waves.exchange/provider-ui-components';

export default function (
    orderParams: TOrderArgs,
    state: IState<IUserWithBalances>
): Promise<ReturnType<typeof order>> {
    return prepareOrder(state, orderParams).then(
        ({ assetsHash, ...orderParams }) => {
            return new Promise<ReturnType<typeof order>>((resolve, reject) => {
                renderPage(
                    React.createElement(SignOrderContainer, {
                        order: orderParams,
                        assetsHash,
                        networkByte: state.networkByte,
                        user: {
                            ...state.user,
                            publicKey: libs.crypto.publicKey({
                                privateKey: state.user.privateKey,
                            }),
                        },
                        onConfirm: () => {
                            resolve(
                                order(orderParams, {
                                    privateKey: state.user.privateKey,
                                })
                            );
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
