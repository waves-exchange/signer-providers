import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import {
    SignLeaseComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { LeaseTransaction } from '@waves/ts-types';
import { PENDING_SIGN_TEXT } from '../../constants/constants';

const { WAVES } = CONSTANTS;
const { cleanAddress, getPrintableNumber, isAlias } = utils;

export const SignLease: FC<ISignTxProps<LeaseTransaction>> = ({
    tx,
    meta,
    user,
    onConfirm,
    onCancel,
}) => {
    const { userBalance } = useTxUser(user);
    const amount = getPrintableNumber(tx.amount, WAVES.decimals);
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    const recipientAddress = isAlias(tx.recipient)
        ? meta.aliases[tx.recipient]
        : tx.recipient;

    const [isPending, setIsPending] = React.useState<boolean>(false);

    const _onConfirm = React.useCallback(
        (e): void => {
            onConfirm(e);
            setIsPending(true);
        },
        [onConfirm]
    );

    return (
        <SignLeaseComponent
            userAddress={user.address}
            userName={user.name}
            userBalance={`${userBalance} ${WAVES.name}`}
            recipientAddress={recipientAddress}
            recipientName={cleanAddress(tx.recipient)}
            tx={tx}
            amount={`${amount} ${WAVES.name}`}
            fee={`${fee} ${WAVES.name}`}
            onReject={onCancel}
            onConfirm={_onConfirm}
            isPending={isPending}
            pendingText={PENDING_SIGN_TEXT}
        />
    );
};
