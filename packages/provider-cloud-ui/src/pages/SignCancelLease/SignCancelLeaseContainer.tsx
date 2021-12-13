import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import {
    SignCancelLeaseComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { CancelLeaseTransaction } from '@waves/ts-types';

const { WAVES } = CONSTANTS;
const { getPrintableNumber } = utils;

export const SignCancelLease: FC<ISignTxProps<CancelLeaseTransaction>> = ({
    tx,
    meta,
    user,
    onConfirm,
    onCancel,
}) => {
    const { userBalance } = useTxUser(user);
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);
    const amount = getPrintableNumber(meta.info.amount, WAVES.decimals);

    return (
        <SignCancelLeaseComponent
            userAddress={user.address}
            userName={user.username}
            userBalance={`${userBalance} ${WAVES.name}`}
            tx={tx}
            amount={`${amount} ${WAVES.name}`}
            fee={`${fee} ${WAVES.ticker}`}
            onReject={onCancel}
            onConfirm={onConfirm}
        />
    );
};
