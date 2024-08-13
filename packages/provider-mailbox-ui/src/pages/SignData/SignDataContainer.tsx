import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import {
    SignDataComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { useTxUser } from '../../hooks/useTxUser';
import { DataTransaction } from '@waves/ts-types';

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

    return (
        <SignDataComponent
            userAddress={user.address}
            userName={user.name}
            userBalance={`${userBalance} WAVES`}
            tx={tx}
            fee={`${fee} WAVES`}
            onConfirm={onConfirm}
            onReject={onCancel}
        />
    );
};
