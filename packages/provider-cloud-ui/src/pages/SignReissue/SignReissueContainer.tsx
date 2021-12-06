import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import { WAVES } from '../../constants';
import { useTxUser } from '../../hooks/useTxUser';
import { getPrintableNumber } from '../../utils/math';
import { SignReissueComponent } from './SignReissueComponent';
import { ReissueTransaction } from '@waves/ts-types';

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
