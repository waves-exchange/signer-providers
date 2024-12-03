import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import {
    SignDataComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { useTxUser } from '../../hooks/useTxUser';
import { DataTransaction } from '@waves/ts-types';
import { PENDING_SIGN_TEXT } from '../../constants/constants';

const { WAVES } = CONSTANTS;
const { getPrintableNumber } = utils;

export const SignDataContainer: FC<ISignTxProps<DataTransaction>> = ({
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
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
        <SignDataComponent
            userAddress={user.address}
            userName={user.name}
            userBalance={`${userBalance} WAVES`}
            tx={tx}
            fee={`${fee} WAVES`}
            onConfirm={_onConfirm}
            onReject={onCancel}
            isPending={isPending}
            pendingText={PENDING_SIGN_TEXT}
        />
    );
};
