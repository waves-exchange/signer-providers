import { IUserWithBalances } from '../interface';
import { IState } from '../interface';
import renderPage from '../utils/renderPage';
import { SignMessageContainer } from '../pages/SignMessage/SignMessageContainer';
import React from 'react';
import { TReceivedMsg } from '../services/mailbox/interface';
import { ERROR } from '../constants/constants';

export default function (
    data: string | number,
    state: IState<IUserWithBalances>
): Promise<string> {
    const mailboxListener = state.mailboxListener;

    return new Promise((resolve, reject) => {
        if (mailboxListener.isClosed) {
            reject(new Error(ERROR.CLOSED_CONNECTION));

            return;
        }

        const msgId = crypto.randomUUID();

        const onMsg = (message: TReceivedMsg) => {
            if (message.resp === 'success' && message.msgId === msgId) {
                mailboxListener.removeCb('onMsg', onMsg);
                resolve(String(message.value));
            }
            if (message.resp === 'declined' && message.msgId === msgId) {
                mailboxListener.removeCb('onMsg', onMsg);
                console.error(message.value.error);
                reject(new Error(message.value.error));
            }
        };

        renderPage(
            React.createElement(SignMessageContainer, {
                data: String(data),
                user: { ...state.user },
                onConfirm: () => {
                    if (mailboxListener.isClosed) {
                        reject(new Error(ERROR.CLOSED_CONNECTION));

                        return;
                    }
                    mailboxListener.addCb('onMsg', onMsg);
                    mailboxListener.sendMsg({
                        resp: 'signMessage',
                        msgId,
                        data: String(data),
                        meta: {
                            referrer: window.location.origin,
                            referrerName: 'Mailbox Signer Provider',
                            iconSrc: 'https://wx.network/img/assets/wx.svg',
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
