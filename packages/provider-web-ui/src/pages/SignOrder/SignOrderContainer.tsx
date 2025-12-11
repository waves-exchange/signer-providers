import React, { FC, useCallback } from 'react';
import {
    DetailsWithLogo,
    SignOrderComponent,
    TOrderArgs,
    utils,
} from '@waves.exchange/provider-ui-components';
import { IUserWithBalances } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';

interface ISignOrderProps {
    order: TOrderArgs;
    assetsHash: Record<string, DetailsWithLogo>;
    user: IUserWithBalances & { publicKey: string };
    networkByte: number;
    onConfirm: () => void;
    onCancel: () => void;
}

export const SignOrderContainer: FC<ISignOrderProps> = ({
    order,
    assetsHash,
    user,
    networkByte,
    onConfirm,
    onCancel,
}) => {
    const { userName, userBalance } = useTxUser(user, networkByte);

    const handleConfirm = useCallback(() => {
        onConfirm();
        utils.analytics.send({ name: 'Signer_Confirm_Message_Approve' });
    }, [onConfirm]);

    const handleReject = useCallback(() => {
        onCancel();
        utils.analytics.send({ name: 'Signer_Confirm_Message_Reject' });
    }, [onCancel]);

    return (
        <SignOrderComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} Waves`}
            assetsHash={assetsHash}
            onConfirm={handleConfirm}
            onReject={handleReject}
            order={order}
        />
    );
};
