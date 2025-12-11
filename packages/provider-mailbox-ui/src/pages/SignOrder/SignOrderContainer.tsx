import React, { FC, useCallback } from 'react';
import {
    DetailsWithLogo,
    SignOrderComponent,
    TOrderArgs,
} from '@waves.exchange/provider-ui-components';
import { IUserWithBalances } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import { utils } from '@waves.exchange/provider-ui-components';
import { PENDING_SIGN_TEXT } from '../../constants/constants';

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
    const [isPending, setIsPending] = React.useState<boolean>(false);

    const handleConfirm = useCallback(() => {
        onConfirm();
        utils.analytics.send({ name: 'Signer_Confirm_Message_Approve' });
        setIsPending(true);
    }, [onConfirm]);

    const handleReject = useCallback(() => {
        onCancel();
        utils.analytics.send({ name: 'Signer_Confirm_Message_Reject' });
    }, [onCancel]);

    return (
        <SignOrderComponent
            userAddress={user.address}
            userName={user.name}
            userBalance={`${userBalance} Waves`}
            assetsHash={assetsHash}
            onConfirm={handleConfirm}
            onReject={handleReject}
            isPending={isPending}
            pendingText={PENDING_SIGN_TEXT}
            order={order}
        />
    );
};
