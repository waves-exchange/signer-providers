import React, { FC, MouseEventHandler, useCallback } from 'react';
import { CreateAccountComponent } from './CreateAccountComponent';
import { utils } from '@waves.exchange/provider-ui-components';

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
        utils.analytics.send({ name: 'Create_Account_Page_Close' });

        onCancel();
    }, [onCancel]);

    return (
        <CreateAccountComponent
            onClose={handleClose}
            isIncognito={isIncognito}
        />
    );
};
