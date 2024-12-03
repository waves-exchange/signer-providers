import React, { FC, useCallback } from 'react';
import { SignMessageComponent } from '@waves.exchange/provider-ui-components';
import { IUserWithBalances } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import { PENDING_SIGN_TEXT } from '../../constants/constants';

interface ISignMessageProps {
    data: string;
    user: IUserWithBalances & { publicKey: string };
    onConfirm: () => void;
    onCancel: () => void;
}

export const SignMessageContainer: FC<ISignMessageProps> = ({
    data,
    user,
    onConfirm,
    onCancel,
}) => {
    const { userBalance } = useTxUser(user);
    const [isPending, setIsPending] = React.useState<boolean>(false);

    const handleConfirm = useCallback(() => {
        onConfirm();
        setIsPending(true);
    }, [onConfirm]);

    const handleReject = useCallback(() => {
        onCancel();
    }, [onCancel]);

    return (
        <SignMessageComponent
            userAddress={user.address}
            userName={user.name}
            userBalance={`${userBalance} Waves`}
            data={data}
            onConfirm={handleConfirm}
            onReject={handleReject}
            isPending={isPending}
            pendingText={PENDING_SIGN_TEXT}
        />
    );
};
