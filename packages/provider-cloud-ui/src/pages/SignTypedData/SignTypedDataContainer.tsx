import React, { FC, useCallback } from 'react';
import { IUserWithBalances } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import { TypedData } from '@waves/signer';
import {
    SignTypedDataComponent,
    utils,
} from '@waves.exchange/provider-ui-components';

interface ISignTypedDataProps {
    data: Array<TypedData>;
    user: IUserWithBalances & { publicKey: string };
    networkByte: number;
    onConfirm: () => void;
    onCancel: () => void;
}

export const SignTypedDataContainer: FC<ISignTypedDataProps> = ({
    data,
    user,
    onConfirm,
    onCancel,
}) => {
    const { userBalance } = useTxUser(user);
    const handleConfirm = useCallback(() => {
        onConfirm();
        utils.analytics.send({ name: 'Confirm_Sign_Typed_Data_Confirm' });
    }, [onConfirm]);
    const handleReject = useCallback(() => {
        onCancel();
        utils.analytics.send({ name: 'Confirm_Sign_Typed_Data_Reject' });
    }, [onCancel]);

    return (
        <SignTypedDataComponent
            userAddress={user.address}
            userName={user.username}
            userBalance={`${userBalance} Waves`}
            data={data}
            onConfirm={handleConfirm}
            onReject={handleReject}
        />
    );
};
