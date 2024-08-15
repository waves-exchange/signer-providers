import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import {
    SignReissueComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { ReissueTransaction } from '@waves/ts-types';
import { PENDING_SIGN_TEXT } from '../../constants/constants';

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

    const [isPending, setIsPending] = React.useState<boolean>(false);

    const _onConfirm = React.useCallback(
        (e): void => {
            onConfirm(e);
            setIsPending(true);
        },
        [onConfirm]
    );

    return (
        <SignReissueComponent
            userAddress={user.address}
            userName={user.name}
            userBalance={`${userBalance} WAVES`}
            tx={tx}
            reissueAmount={`${getPrintableNumber(
                tx.quantity,
                reissueAsset.decimals
            )} ${reissueAsset.name}`}
            reissueAsset={reissueAsset}
            fee={`${fee} WAVES`}
            onConfirm={_onConfirm}
            onReject={onCancel}
            isPending={isPending}
            pendingText={PENDING_SIGN_TEXT}
        />
    );
};
