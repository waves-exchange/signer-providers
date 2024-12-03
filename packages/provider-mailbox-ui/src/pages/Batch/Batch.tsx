import React, { FC } from 'react';
import { batchPage } from '@waves.exchange/provider-ui-components';
import { Transaction, Long } from '@waves/ts-types';
import { PENDING_SIGN_TEXT } from '../../constants/constants';
import { ITransactionInfo } from '@waves.exchange/provider-ui-components';
import { MouseEventHandler } from 'react';

interface IBatchProps {
    networkByte: number;
    list: Array<ITransactionInfo<Transaction>>;
    user: {
        address: string;
        publicKey: string;
        balance: Long;
        name?: string;
    };
    onConfirm: MouseEventHandler;
    onCancel: () => void;
}

export const BatchContainer: FC<IBatchProps> = ({
    networkByte,
    list,
    user,
    onConfirm,
    onCancel,
}) => {
    const [isPending, setIsPending] = React.useState<boolean>(false);

    const _onConfirm = React.useCallback(
        (e): void => {
            onConfirm(e);
            setIsPending(true);
        },
        [onConfirm]
    );

    return batchPage({
        networkByte: networkByte,
        sender: user.address,
        user: {
            address: user.address,
            publicKey: user.publicKey,
            balance: user.balance,
            name: user.name,
        },
        list,
        onConfirm: _onConfirm,
        onCancel,
        isPending,
        pendingText: PENDING_SIGN_TEXT,
    });
};
