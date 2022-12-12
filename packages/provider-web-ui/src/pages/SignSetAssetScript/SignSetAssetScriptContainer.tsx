import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import {
    SignSetAssetScript as SignSetAssetScriptComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { SetAssetScriptTransaction } from '@waves/ts-types';
import { useTxUser } from '../../hooks/useTxUser';

const { WAVES } = CONSTANTS;
const { getPrintableNumber } = utils;

export const SignSetAssetScriptContainer: FC<
    ISignTxProps<SetAssetScriptTransaction>
> = ({ meta: txMeta, networkByte, tx, user, onConfirm, onCancel }) => {
    const asset = txMeta.assets[tx.assetId];
    const { userName, userBalance } = useTxUser(user, networkByte);

    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    return (
        <SignSetAssetScriptComponent
            key={tx.id}
            userAddress={user.address}
            userName={userName}
            userBalance={userBalance}
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
