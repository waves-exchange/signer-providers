import { SignerTx } from '@waves/signer';
import { Transaction } from '@waves/ts-types';
import { IUserWithBalances } from '../interface';
import { IState } from '../interface';
import { ITransactionInfo } from '@waves.exchange/provider-ui-components';
import renderPage from '../utils/renderPage';
import { TReceivedMsg } from '../services/mailbox/interface';
import { BatchContainer } from '../pages/Batch/Batch';
import React from 'react';

export default function (
    list: Array<ITransactionInfo<Transaction>>,
    state: IState<IUserWithBalances>
): Promise<Array<SignerTx>> {
    const mailboxListener = state.mailboxListener;

    return new Promise((resolve, reject) => {
        const msgId = crypto.randomUUID();

        const onMsg = (message: TReceivedMsg) => {
            if (message.resp === 'success' && message.msgId === msgId) {
                mailboxListener.removeCb('onMsg', onMsg);
                resolve(message.value);
            }
            if (message.resp === 'declined' && message.msgId === msgId) {
                mailboxListener.removeCb('onMsg', onMsg);
                console.error(message.value.error);
                reject(new Error(message.value.error));
            }
        };

        renderPage(
            React.createElement(BatchContainer, {
                networkByte: state.networkByte,
                user: {
                    address: state.user.address,
                    publicKey: state.user.publicKey,
                    balance: state.user.balance,
                    name: state.user.name,
                },
                list,
                onConfirm: () => {
                    mailboxListener.addCb('onMsg', onMsg);
                    mailboxListener.sendMsg({
                        resp: 'sign',
                        msgId,
                        data: list.map(({ tx }) => tx),
                        meta: {
                            referrer: window.location.origin,
                            referrerName: 'Mailbox Signer Provider',
                            iconSrc: 'https://wx.network/img/assets/wx.svg',
                        },
                    });
                },
                onCancel: () => {
                    mailboxListener.removeCb('onMsg', onMsg);
                    reject(new Error('User rejection!'));
                },
            })
        );
    });
}
