import React from 'react';
import { PlateNote } from '@waves.exchange/react-uikit';

export const Error: React.FC<{ error: string }> = React.memo(({ error }) => {
    return (
        <PlateNote
            type="error"
            color="standard.$0"
            fontSize="14px"
            lineHeight="20px"
        >
            {error}
        </PlateNote>
    );
});
