import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import {
    SignSetAssetScript as SignSetAssetScriptComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { SetAssetScriptTransaction } from '@waves/ts-types';
import { useTxUser } from '../../hooks/useTxUser';
import { PENDING_SIGN_TEXT } from '../../constants/constants';

const { WAVES } = CONSTANTS;
const { getPrintableNumber } = utils;

export const SignSetAssetScriptContainer: FC<
    ISignTxProps<SetAssetScriptTransaction>
> = ({ meta: txMeta, tx, user, onConfirm, onCancel }) => {
    const asset = txMeta.assets[tx.assetId];
    const { userBalance } = useTxUser(user);

    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    const [isPending, setIsPending] = React.useState<boolean>(false);

    const _onConfirm = React.useCallback(
        (e): void => {
            onConfirm(e);
            setIsPending(true);
        },
        [onConfirm]
    );

    return (
        <SignSetAssetScriptComponent
            key={tx.id}
            userAddress={user.address}
            userName={user.name}
            userBalance={userBalance}
            tx={tx}
            fee={`${fee} WAVES`}
            assetId={asset.assetId}
            assetName={asset.name}
            assetScript={tx.script}
            onCancel={onCancel}
            onConfirm={_onConfirm}
            isPending={isPending}
            pendingText={PENDING_SIGN_TEXT}
        />
    );
};
