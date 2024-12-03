import React from 'react';
import { DotLoader, Flex, Text } from '@waves.exchange/react-uikit';

export const WaitingForLogIn: React.FC = React.memo(() => {
    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Text
                variant="body1"
                color="standard.$0"
                textAlign="center"
                mb="16px"
                fontWeight={300}
                sx={{
                    whiteSpace: 'break-spaces',
                }}
            >
                {`Waiting for Log In in WX.Network.\nDon't close this window until Log In.`}
            </Text>
            <DotLoader />
        </Flex>
    );
});
