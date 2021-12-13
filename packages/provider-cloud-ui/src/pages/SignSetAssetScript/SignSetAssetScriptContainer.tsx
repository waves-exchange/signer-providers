import { SetAssetScriptTransaction } from '@waves/ts-types';
import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import {
    SignSetAssetScript as SignSetAssetScriptComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';

const { WAVES } = CONSTANTS;
const { getPrintableNumber } = utils;

export const SignSetAssetScriptContainer: FC<
    ISignTxProps<SetAssetScriptTransaction>
> = ({ meta: txMeta, tx, user, onConfirm, onCancel }) => {
    const asset = txMeta.assets[tx.assetId];

    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    return (
        <SignSetAssetScriptComponent
            key={tx.id}
            userAddress={user.address}
            userName={user.username}
            userBalance={`${getPrintableNumber(
                user.balance,
                WAVES.decimals
            )} Waves`}
            tx={tx}
            fee={`${fee} WAVES`}
            assetId={asset.assetId}
            assetName={asset.name}
            assetScript={tx.script}
            onCancel={onCancel}
            onConfirm={onConfirm}
        />
    );
};
