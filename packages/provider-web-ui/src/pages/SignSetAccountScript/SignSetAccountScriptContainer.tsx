import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import { getUserName } from '../../services/userService';
import {
    SignSetAccountScriptComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { SetScriptTransaction } from '@waves/ts-types';

const { WAVES } = CONSTANTS;
const { getPrintableNumber } = utils;

export const SignSetAccountScript: FC<ISignTxProps<SetScriptTransaction>> = ({
    networkByte,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    return (
        <SignSetAccountScriptComponent
            key={tx.id}
            userAddress={user.address}
            userName={getUserName(networkByte, user.publicKey)}
            userBalance={`${getPrintableNumber(user.balance, WAVES.decimals)} ${
                WAVES.name
            }`}
            userHasScript={user.hasScript}
            tx={tx}
            fee={`${fee} ${WAVES.name}`}
            accountScript={tx.script}
            onCancel={onCancel}
            onConfirm={onConfirm}
        />
    );
};
