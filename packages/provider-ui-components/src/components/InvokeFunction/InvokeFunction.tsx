import React, { FC } from 'react';
import { InvokeScriptCallArgument, Long } from '@waves/ts-types';
import { Text, Flex, TFlexProps } from '@waves.exchange/react-uikit';
import { getAttrStyles, getAttrContent } from './helpers';
import {
    wrapperStylesEnd,
    wrapperStylesStart,
    pseudoElemStyles,
} from './styles';

interface IProps {
    name: string;
    args: Array<InvokeScriptCallArgument<Long>>;
}
export const InvokeFunction: FC<IProps & TFlexProps> = ({
    args,
    name,
    ...rest
}) => (
    <Flex sx={wrapperStylesEnd} fontSize="$13" lineHeight="$18" {...rest}>
        <Text isTruncated>
            <Text sx={pseudoElemStyles}>{name}</Text>
            <Text sx={wrapperStylesStart}>
                {args.map(({ type, value }, index) => (
                    <Text
                        key={index}
                        sx={
                            getAttrStyles(
                                type,
                                index === args.length - 1
                            ) as any
                        }
                    >
                        {getAttrContent(type, value)}
                    </Text>
                ))}
            </Text>
        </Text>
    </Flex>
);
