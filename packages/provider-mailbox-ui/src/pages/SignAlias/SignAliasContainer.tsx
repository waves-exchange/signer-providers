import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import {
    SignAliasComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { AliasTransaction } from '@waves/ts-types';

const { WAVES } = CONSTANTS;
const { getPrintableNumber } = utils;

export const SignAliasContainer: FC<ISignTxProps<AliasTransaction>> = ({
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const { userBalance } = useTxUser(user);
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    return (
        <SignAliasComponent
            userAddress={user.address}
            userName={user.name}
            userBalance={`${userBalance} WAVES`}
            userHasScript={user.hasScript}
            tx={tx}
            fee={`${fee} WAVES`}
            onConfirm={onConfirm}
            onReject={onCancel}
        />
    );
};
