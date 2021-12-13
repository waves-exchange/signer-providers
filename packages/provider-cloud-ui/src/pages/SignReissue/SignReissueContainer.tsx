import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import {
    SignReissueComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { ReissueTransaction } from '@waves/ts-types';

const { WAVES } = CONSTANTS;
const { getPrintableNumber } = utils;

export const SignReissueContainer: FC<ISignTxProps<ReissueTransaction>> = ({
    tx,
    meta,
    user,
    onConfirm,
    onCancel,
}) => {
    const { userBalance } = useTxUser(user);
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);
    const reissueAsset = tx.assetId === null ? WAVES : meta.assets[tx.assetId];

    return (
        <SignReissueComponent
            userAddress={user.address}
            userName={user.username}
            userBalance={`${userBalance} WAVES`}
            tx={tx}
            reissueAmount={`${getPrintableNumber(
                tx.quantity,
                reissueAsset.decimals
            )} ${reissueAsset.name}`}
            reissueAsset={reissueAsset}
            fee={`${fee} WAVES`}
            onConfirm={onConfirm}
            onReject={onCancel}
        />
    );
};
