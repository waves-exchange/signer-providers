import * as React from 'react';
import {
    Box,
    Icon,
    Text,
    ExternalLink,
    Button,
    IconButton,
    Flex,
    iconClose,
} from '@waves.exchange/react-uikit';
import { iconAttention } from './iconAttension';

interface Required2faComponentProps {
    onClose: () => void;
}

export const Required2faComponent: React.FC<Required2faComponentProps> = ({
    onClose,
}) => {
    return (
        <Box bg="main.$800" width="520px" borderRadius="$6">
            <Flex
                height={65}
                p="20px 24px 20px 40px"
                borderBottom="1px solid"
                borderColor="#3a4050"
                mb="32px"
                position="relative"
            >
                <Text
                    as="h2"
                    fontSize="17px"
                    lineHeight="24px"
                    mb="24px"
                    color="standard.$0"
                    fontWeight={500}
                    margin={0}
                >
                    <Text ml="10px">Enable 2FA</Text>
                </Text>

                <IconButton
                    ml="auto"
                    size={25}
                    color="basic.$700"
                    _hover={{ color: 'basic.$500' }}
                    onClick={onClose}
                >
                    <Icon icon={iconClose} />
                </IconButton>
            </Flex>
            <Box textAlign="center" px="40px" py="32px">
                <Icon
                    size="80px"
                    icon={iconAttention}
                    color="#FFAF00"
                    mb="32px"
                />
                <Text
                    fontSize="20px"
                    lineHeight="24px"
                    display="block"
                    color="#fff"
                    mb="32px"
                >
                    This feature is available only with 2FA enabled
                </Text>
                <ExternalLink href="https://wx.network/settings">
                    <Button
                        variant="primary"
                        variantSize="medium"
                        width="100%"
                        onClick={onClose}
                    >
                        Enable 2FA
                    </Button>
                </ExternalLink>
            </Box>
        </Box>
    );
};
