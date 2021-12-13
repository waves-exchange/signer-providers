import React, { FC, useCallback, useEffect } from 'react';
import { SignMessageComponent } from '@waves.exchange/provider-ui-components';
import { IUserWithBalances } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import { utils } from '@waves.exchange/provider-ui-components';

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
    networkByte,
    onConfirm,
    onCancel,
}) => {
    const { userName, userBalance } = useTxUser(user, networkByte);

    const handleConfirm = useCallback(() => {
        onConfirm();
        utils.analytics.send({ name: 'Confirm_Sign_Message_Confirm' });
    }, [onConfirm]);

    const handleReject = useCallback(() => {
        onCancel();
        utils.analytics.send({ name: 'Confirm_Sign_Message_Reject' });
    }, [onCancel]);

    useEffect(
        () =>
            utils.analytics.send({
                name: 'Confirm_Sign_Message_Show',
            }),
        []
    );

    return (
        <SignMessageComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} Waves`}
            data={data}
            onConfirm={handleConfirm}
            onReject={handleReject}
        />
    );
};
