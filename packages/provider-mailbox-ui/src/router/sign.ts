import { fetchNodeTime } from '@waves/node-api-js/es/api-node/utils';
import { TRANSACTION_TYPE_MAP } from '@waves/node-api-js/es/interface';
import { SignedTx, SignerTx } from '@waves/signer';
import React, { ReactNode } from 'react';
import { IUserWithBalances } from '../interface';
import { CONSTANTS } from '@waves.exchange/provider-ui-components';
import { IState } from '../interface';
import { SignAliasContainer } from '../pages/SignAlias/SignAliasContainer';
import { SignBurnContainer } from '../pages/SignBurn/SignBurnContainer';
import { SignCancelLease } from '../pages/SignCancelLease/SignCancelLeaseContainer';
import { SignDataContainer } from '../pages/SignData/SignDataContainer';
import { SignInvoke } from '../pages/SignInvoke/SignInvokeContainer';
import { SignIssueContainer } from '../pages/SignIssue/SignIssueContainer';
import { SignLease } from '../pages/SignLease/SignLeaseContainer';
import { SignReissueContainer } from '../pages/SignReissue/SignReissueContainer';
import { SignSetAccountScript } from '../pages/SignSetAccountScript/SignSetAccountScriptContainer';
import { SignSetAssetScriptContainer } from '../pages/SignSetAssetScript/SignSetAssetScriptContainer';
import { SignSponsorship } from '../pages/SignSponsorship/SignSponsorshipContainer';
import { SignTransfer } from '../pages/SignTransfer/SignTransfer';
import { prepareTransactions } from '../services/transactionsService';
import renderPage from '../utils/renderPage';
import batch from './batch';
import { TReceivedMsg } from '../services/mailbox/interface';

const { NAME_MAP } = CONSTANTS;

const getPageByType = (type: keyof TRANSACTION_TYPE_MAP): ReactNode => {
    switch (type) {
        case NAME_MAP.transfer:
            return SignTransfer;
        case NAME_MAP.invoke:
            return SignInvoke;
        case NAME_MAP.data:
            return SignDataContainer;
        case NAME_MAP.issue:
            return SignIssueContainer;
        case NAME_MAP.lease:
            return SignLease;
        case NAME_MAP.cancelLease:
            return SignCancelLease;
        case NAME_MAP.alias:
            return SignAliasContainer;
        case NAME_MAP.massTransfer:
            return SignTransfer;
        case NAME_MAP.setScript:
            return SignSetAccountScript;
        case NAME_MAP.sponsorship:
            return SignSponsorship;
        case NAME_MAP.setAssetScript:
            return SignSetAssetScriptContainer;
        case NAME_MAP.burn:
            return SignBurnContainer;
        case NAME_MAP.reissue:
            return SignReissueContainer;
        default:
            throw new Error('Unsupported transaction!');
    }
};

export default function (
    list: Array<SignerTx>,
    state: IState<IUserWithBalances>
): Promise<Array<SignedTx<SignerTx>>> {
    return fetchNodeTime(state.nodeUrl)
        .then((nodeTime) => nodeTime.NTP)
        .catch(() => Date.now())
        .then((time) =>
            prepareTransactions(state, list, time).then((transactions) => {
                if (transactions.length !== 1) {
                    return batch(transactions, state);
                }

                const tx = transactions[0].tx;

                const [info] = transactions;

                const mailboxListener = state.mailboxListener;

                return new Promise<any>((resolve, reject) => {
                    const msgId = crypto.randomUUID();

                    const onMsg = (message: TReceivedMsg) => {
                        if (
                            message.resp === 'success' &&
                            message.msgId === msgId
                        ) {
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

                    const props = {
                        ...info,
                        networkByte: state.networkByte,
                        user: {
                            ...state.user,
                            publicKey: state.user.publicKey,
                        },
                        onConfirm: () => {
                            mailboxListener.addCb('onMsg', onMsg);
                            mailboxListener.sendMsg({
                                resp: 'sign',
                                msgId,
                                data: tx,
                                meta: {
                                    referrer: window.location.origin,
                                    referrerName: 'Mailbox Signer Provider',
                                    iconSrc:
                                        'https://wx.network/img/assets/wx.svg',
                                },
                            });
                        },
                        onCancel: () => {
                            mailboxListener.removeCb('onMsg', onMsg);
                            reject(new Error('User rejection!'));
                        },
                    };

                    renderPage(
                        React.createElement(
                            getPageByType(info.tx.type as any) as any,
                            {
                                key: info.tx.id,
                                ...props,
                            }
                        )
                    );
                });
            })
        );
}
