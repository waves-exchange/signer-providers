import React, { FC, useCallback } from 'react';
import {
    DetailsWithLogo,
    SignOrderComponent,
} from '@waves.exchange/provider-ui-components';
import { IUserWithBalances } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import { utils } from '@waves.exchange/provider-ui-components';
import { IOrderParams } from '@waves/waves-transactions';

interface ISignOrderProps {
    order: IOrderParams;
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
        utils.analytics.send({ name: 'Signer_Confirm_Message_Approve' });
    }, [onConfirm]);

    const handleReject = useCallback(() => {
        onCancel();
        utils.analytics.send({ name: 'Signer_Confirm_Message_Reject' });
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
