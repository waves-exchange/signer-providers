import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import {
    SignBurn as SignBurnComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { BurnTransaction } from '@waves/ts-types';
import { useTxUser } from '../../hooks/useTxUser';

const { WAVES } = CONSTANTS;
const { getPrintableNumber } = utils;

export const SignBurnContainer: FC<ISignTxProps<BurnTransaction>> = ({
    meta: txMeta,
    networkByte,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const { userName } = useTxUser(user, networkByte);
    const burnAsset = tx.assetId === null ? WAVES : txMeta.assets[tx.assetId];
    const feeAsset = WAVES;

    const burnAmount = getPrintableNumber(tx.amount, burnAsset.decimals);

    const fee = getPrintableNumber(tx.fee, feeAsset.decimals);

    return (
        <SignBurnComponent
            key={tx.id}
            userAddress={user.address}
            userName={userName}
            userBalance={`${getPrintableNumber(
                user.balance,
                WAVES.decimals
            )} Waves`}
            tx={tx}
            fee={`${fee} ${feeAsset.ticker}`}
            burnAmount={`-${burnAmount} ${burnAsset.name}`}
            assetId={burnAsset.assetId}
            assetName={burnAsset.name}
            isSmartAsset={burnAsset.scripted}
            onCancel={onCancel}
            onConfirm={onConfirm}
        />
    );
};
