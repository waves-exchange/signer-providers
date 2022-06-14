import React, { FC, MouseEventHandler, useCallback } from 'react';
import { CreateAccountComponent } from './CreateAccountComponent';

type CreateAccountProps = {
    networkByte: number;
    isIncognito: boolean;
    onCancel(): void;
};

export const CreateAccount: FC<CreateAccountProps> = ({
    networkByte,
    onCancel,
    isIncognito,
}) => {
    const handleClose = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        onCancel();
    }, [onCancel]);

    return (
        <CreateAccountComponent
            networkByte={networkByte}
            onClose={handleClose}
            isIncognito={isIncognito}
        />
    );
};
