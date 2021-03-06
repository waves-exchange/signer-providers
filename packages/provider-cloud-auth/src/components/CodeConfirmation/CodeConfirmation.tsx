import { Box, Flex, Text } from '@waves.exchange/react-uikit';
import React, { FC, useState } from 'react';
import { CodeDelivery } from '../../IdentityService';
import { VerifyCodeComponent } from '../VerifyCodeComponent/VerifyCodeComponent';

type CodeConfirmationProps = {
    codeDelivery: CodeDelivery | undefined;
    confirmCode(code: string): Promise<void>;
    resendCode?(): Promise<void>;
};

export const CodeConfirmation: FC<CodeConfirmationProps> = ({
    codeDelivery,
    confirmCode,
    resendCode,
}) => {
    const [isPending, setIsPending] = useState<boolean>(false);

    const handleConfirmCode = React.useCallback(
        async (code: string): Promise<boolean> => {
            try {
                await confirmCode(code);

                return true;
            } catch (e) {
                return false;
            }
        },
        [confirmCode]
    );

    const destination = codeDelivery?.destination;

    return (
        <Flex
            as="form"
            px="$40"
            pb="$40"
            flexDirection="column"
            justifyContent="center"
        >
            <Box mb="24px" textAlign="center">
                <Text variant="body2" color="basic.$500">
                    Please enter the 6-digit verification code received by{' '}
                    {destination}.
                </Text>

                {codeDelivery?.type === 'EMAIL' && (
                    <Text variant="body2" color="basic.$500">
                        {' '}
                        If you don't receive the code, check the spam box or
                        resend the code again.
                    </Text>
                )}
            </Box>

            <Flex justifyContent="center">
                <VerifyCodeComponent
                    isPending={isPending}
                    isCodeSent={Boolean(codeDelivery)}
                    inputMode="decimal"
                    onPendingChange={setIsPending}
                    onSendCode={resendCode}
                    onApplyCode={handleConfirmCode}
                />
            </Flex>
        </Flex>
    );
};
