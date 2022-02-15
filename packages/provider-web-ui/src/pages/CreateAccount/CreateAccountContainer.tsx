import React, { FC, MouseEventHandler, useCallback } from 'react';
import { CreateAccountComponent } from './CreateAccountComponent';

type CreateAccountProps = {
    isIncognito: boolean;
    onCancel(): void;
};

export const CreateAccount: FC<CreateAccountProps> = ({
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
            onClose={handleClose}
            isIncognito={isIncognito}
        />
    );
};
