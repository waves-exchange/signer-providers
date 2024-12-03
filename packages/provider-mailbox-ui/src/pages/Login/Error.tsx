import React from 'react';
import { Button, PlateNote } from '@waves.exchange/react-uikit';

interface IError {
    error: string;
    onTryAgain?: () => void;
}

export const Error: React.FC<IError> = React.memo(({ error, onTryAgain }) => {
    return (
        <>
            <PlateNote
                type="error"
                color="standard.$0"
                fontSize="14px"
                lineHeight="20px"
            >
                {error}
            </PlateNote>
            {typeof onTryAgain === 'function' ? (
                <Button
                    variant="primary"
                    variantSize="medium"
                    width="100%"
                    mt={20}
                    onClick={onTryAgain}
                >
                    Try again
                </Button>
            ) : null}
        </>
    );
});
