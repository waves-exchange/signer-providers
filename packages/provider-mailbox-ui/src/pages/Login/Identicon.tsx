import React from 'react';
import { Box, Flex, Text } from '@waves.exchange/react-uikit';

export const Identicon: React.FC<{ imgSrc: string }> = React.memo(
    ({ imgSrc }) => {
        return (
            <Flex width="100%" flexDirection="column" alignItems="center">
                <Text
                    variant="body1"
                    color="standard.$0"
                    display="inline-block"
                    mb={16}
                >
                    Please compare the Identicon below with the Identicon opened
                    on the WX.Network domain tab and confirm there that they
                    fully match.
                </Text>
                <Flex
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor="basic.$900"
                    borderRadius="12px"
                    width="140px"
                    height="140px"
                    mb="40px"
                >
                    <Box
                        width={100}
                        height={100}
                        m="auto"
                        borderRadius={10}
                        overflow="hidden"
                    >
                        <img
                            src={imgSrc}
                            width={100}
                            height={100}
                            alt="identicon"
                        />
                    </Box>
                </Flex>
            </Flex>
        );
    }
);
