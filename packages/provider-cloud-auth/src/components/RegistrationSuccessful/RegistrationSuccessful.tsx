import React, { FC } from 'react';
import { Box, Button } from '@waves.exchange/react-uikit';
import imgUrl from '../../../img/astronaut.svg';

export const RegistrationSuccessful: FC<{ onLogin: () => void }> = ({
    onLogin,
}) => {
    return (
        <Box px="24px">
            <Box
                width="100%"
                height="174px"
                backgroundImage={`url(${imgUrl})`}
                mb="24px"
            />
            <Box color="#9ba6b2" fontSize="13px" textAlign="center" mb="16px">
                To start trading and investing with WX.Network, please log in.
            </Box>
            <Box px="16px" mb="40px">
                <Button
                    variant="primary"
                    variantSize="medium"
                    width="100%"
                    onClick={onLogin}
                >
                    Log In
                </Button>
            </Box>
        </Box>
    );
};
