import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import {
    SignSetAccountScriptComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { SetScriptTransaction } from '@waves/ts-types';
import { useTxUser } from '../../hooks/useTxUser';
import { PENDING_SIGN_TEXT } from '../../constants/constants';

const { WAVES } = CONSTANTS;
const { getPrintableNumber } = utils;

export const SignSetAccountScript: FC<ISignTxProps<SetScriptTransaction>> = ({
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
        <SignSetAccountScriptComponent
            key={tx.id}
            userAddress={user.address}
            userName={user.name}
            userBalance={userBalance}
            userHasScript={user.hasScript}
            tx={tx}
            fee={`${fee} ${WAVES.name}`}
            accountScript={tx.script}
            onCancel={onCancel}
            onConfirm={_onConfirm}
            isPending={isPending}
            pendingText={PENDING_SIGN_TEXT}
        />
    );
};
