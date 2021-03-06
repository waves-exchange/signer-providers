import { Flex, DotLoader } from '@waves.exchange/react-uikit';
import React from 'react';

export const Preload: React.FC = () => {
    return (
        <Flex
            backgroundColor="main.$800"
            width="520px"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            borderRadius="$6"
            height="584px"
        >
            <DotLoader />
        </Flex>
    );
};
