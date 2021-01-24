import { Box, BoxProps } from '@waves.exchange/react-uikit';
import React, { FC } from 'react';

type InputWrapperProps = BoxProps & {
    label: string;
    labelVisible: boolean;
};

export const InputWrapper: FC<InputWrapperProps> = ({
    label,
    labelVisible,
    children,
    as: _as, // Types difference in react 16 vs 17 - added slot in ElementType
    ...rest
}) => (
    <Box
        position="relative"
        sx={{
            '&::before': {
                content: `"${label}"`,
                position: 'absolute',
                top: '4px',
                left: '20px',
                color: 'basic.$500',
                fontSize: '9px',
                zIndex: 1,
                transition: 'opacity 0.15s ease-in',
                opacity: labelVisible ? 1 : 0,
            },
        }}
        {...rest}
    >
        {children}
    </Box>
);
