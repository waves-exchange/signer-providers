import React, { FC, useCallback, useEffect } from 'react';
import { SignMessageComponent } from './SignMessageComponent';
import { IUserWithBalances } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import { analytics } from '../../utils/analytics';

interface ISignMessageProps {
    data: string;
    user: IUserWithBalances & { publicKey: string };
    networkByte: number;
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

    const handleConfirm = useCallback(() => {
        onConfirm();
        analytics.send({ name: 'Confirm_Sign_Message_Confirm' });
    }, [onConfirm]);

    const handleReject = useCallback(() => {
        onCancel();
        analytics.send({ name: 'Confirm_Sign_Message_Reject' });
    }, [onCancel]);

    useEffect(
        () =>
            analytics.send({
                name: 'Confirm_Sign_Message_Show',
            }),
        []
    );

    return (
        <SignMessageComponent
            userAddress={user.address}
            userName={user.username}
            userBalance={`${userBalance} Waves`}
            data={data}
            onConfirm={handleConfirm}
            onReject={handleReject}
        />
    );
};
