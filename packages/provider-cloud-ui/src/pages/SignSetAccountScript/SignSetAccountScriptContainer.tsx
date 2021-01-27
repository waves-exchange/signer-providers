import { SetScriptTransaction } from '@waves/ts-types';
import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import { WAVES } from '../../constants';
import { getPrintableNumber } from '../../utils/math';
import { SignSetAccountScriptComponent } from './SignSetAccountScriptComponent';

export const SignSetAccountScript: FC<ISignTxProps<SetScriptTransaction>> = ({
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
            userName={user.username}
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
