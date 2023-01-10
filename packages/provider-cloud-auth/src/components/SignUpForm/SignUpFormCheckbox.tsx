import { Checkbox, Flex, Text } from '@waves.exchange/react-uikit';
import * as React from 'react';

interface SignUpFormCheckboxProps {
    isChecked: boolean;
    onChange: (event: any) => void;
}

export const SignUpFormCheckbox: React.FC<SignUpFormCheckboxProps> = ({
    isChecked,
    onChange,
    children,
}) => {
    return (
        <Flex mb="24px">
            <Checkbox
                alignItems="top"
                color="standard.$0"
                checked={isChecked}
                onChange={onChange}
            >
                <Text pl="$10" variant="body2" fontWeight={200}>
                    {children}
                </Text>
            </Checkbox>
        </Flex>
    );
};

SignUpFormCheckbox.displayName = 'SignUpFormCheckbox';
