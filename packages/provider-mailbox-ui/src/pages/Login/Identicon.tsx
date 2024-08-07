import React from 'react';
import { Box } from '@waves.exchange/react-uikit';

export const Identicon: React.FC<{ imgSrc: string }> = React.memo(
    ({ imgSrc }) => {
        return (
            <Box
                width={100}
                height={100}
                m="auto"
                mt={16}
                borderRadius={10}
                overflow="hidden"
            >
                <img src={imgSrc} width={100} height={100} alt="identicon" />
            </Box>
        );
    }
);
