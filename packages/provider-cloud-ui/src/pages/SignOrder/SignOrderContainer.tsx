import React, { FC, useCallback } from 'react';
import {
    DetailsWithLogo,
    SignOrderComponent,
    TOrderArgs,
} from '@waves.exchange/provider-ui-components';
import { IUserWithBalances } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';

interface ISignOrderProps {
    order: TOrderArgs;
    assetsHash: Record<string, DetailsWithLogo>;
    user: IUserWithBalances & { publicKey: string };
    onConfirm: () => void;
    onCancel: () => void;
}

export const SignOrderContainer: FC<ISignOrderProps> = ({
    order,
    assetsHash,
    user,
    onConfirm,
    onCancel,
}) => {
    const { userBalance } = useTxUser(user);

    const handleConfirm = useCallback(() => {
        onConfirm();
    }, [onConfirm]);

    const handleReject = useCallback(() => {
        onCancel();
    }, [onCancel]);

    return (
        <SignOrderComponent
            userAddress={user.address}
            userName={user.username}
            userBalance={`${userBalance} Waves`}
            assetsHash={assetsHash}
            onConfirm={handleConfirm}
            onReject={handleReject}
            order={order}
        />
    );
};
