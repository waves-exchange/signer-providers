import { SignedTx, SignerTx } from '@waves/signer';
import { libs, order, IOrderParams } from '@waves/waves-transactions';
import React from 'react';
import { IUserWithBalances } from '../interface';
import { IState } from '../interface';
import renderPage from '../utils/renderPage';
import { prepareOrder } from '../services/prepareOrder';
import { SignOrderContainer } from '../pages/SignOrder/SignOrderContainer';
import { ERROR } from '../constants/constants';
import { TReceivedMsg } from '../services/mailbox/interface';

export default function (
    orderParams: IOrderParams,
    state: IState<IUserWithBalances>
): Promise<Array<SignedTx<SignerTx>>> {
    return prepareOrder(state, orderParams).then(
        ({ assetsHash, ...orderParams }) => {
            const mailboxListener = state.mailboxListener;

            return new Promise<any>((resolve, reject) => {
                if (mailboxListener.isClosed) {
                    reject(new Error(ERROR.CLOSED_CONNECTION));

                    return;
                }

                const msgId = crypto.randomUUID();

                const onMsg = (message: TReceivedMsg) => {
                    if (message.resp === 'success' && message.msgId === msgId) {
                        mailboxListener.removeCb('onMsg', onMsg);
                        resolve(message.value);
                    }
                    if (
                        message.resp === 'declined' &&
                        message.msgId === msgId
                    ) {
                        mailboxListener.removeCb('onMsg', onMsg);
                        console.error(message.value.error);
                        reject(new Error(message.value.error));
                    }
                };

                renderPage(
                    React.createElement(SignOrderContainer, {
                        order: orderParams,
                        assetsHash,
                        user: {
                            ...state.user,
                            publicKey: state.user.publicKey,
                        },
                        onConfirm: () => {
                            if (mailboxListener.isClosed) {
                                reject(new Error(ERROR.CLOSED_CONNECTION));

                                return;
                            }
                            mailboxListener.addCb('onMsg', onMsg);
                            mailboxListener.sendMsg({
                                resp: 'signOrder',
                                msgId,
                                data: orderParams,
                                meta: {
                                    referrer: window.document.referrer,
                                    referrerName: 'Mailbox Signer Provider',
                                    iconSrc:
                                        'https://wx.network/img/assets/wx.svg',
                                    userAddress: state.user.address,
                                },
                            });
                        },
                        onCancel: () => {
                            mailboxListener.removeCb('onMsg', onMsg);
                            reject(
                                new Error(
                                    mailboxListener.isClosed
                                        ? ERROR.CLOSED_CONNECTION
                                        : ERROR.USER_REJECT
                                )
                            );
                        },
                    })
                );
            });
        }
    );
}
