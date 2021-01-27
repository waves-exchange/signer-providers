/**
 * This component was copypasted from waves.exchange WebGUI project almost as is
 * @see https://gitlab.waves.exchange/we-private/webgui
 * file react-components/app/components/VerifyCodeComponent/index.tsx
 */

import * as React from 'react';
import {
    Box,
    Button,
    DotLoader,
    Flex,
    Input,
    Text,
} from '@waves.exchange/react-uikit';

type VerifyCodeComponentProps = {
    isPending: boolean;
    codeLength?: number;
    timerTime?: number;
    isCodeSent?: boolean;
    disableAfterMistake?: boolean;
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
    onPendingChange(isPending: boolean): void;
    onSendCode?(): Promise<void>;
    onValidationFunc?(value: string): boolean;
    onApplyCode?(code: string): Promise<boolean>;
};

export const VerifyCodeComponent: React.FC<VerifyCodeComponentProps> = ({
    codeLength = 6,
    timerTime = 59,
    onSendCode,
    onValidationFunc,
    onApplyCode,
    disableAfterMistake,
    onPendingChange: onPending,
    isPending,
    isCodeSent = true,
    inputMode,
}) => {
    const [secondsLeft, setSecondsLeft] = React.useState(
        isCodeSent ? timerTime : 0
    );
    const [isIncorrectCode, setIsIncorrectCode] = React.useState<boolean>(
        false
    );
    const [isFilled, setIsFilled] = React.useState<boolean>(false);
    const [isDisabled, setIsDisabled] = React.useState<boolean>(false);
    const refs = React.useMemo((): Array<React.RefObject<HTMLInputElement>> => {
        return new Array(codeLength)
            .fill(undefined)
            .map(() => React.createRef());
    }, [codeLength]);
    const [values, setValues] = React.useState<Array<string>>(
        refs.map(() => '')
    );
    const [autoFocusIndex, setAutoFocusIndex] = React.useState<number>(0);

    React.useEffect(() => {
        if (secondsLeft) {
            const timeoutId = setTimeout(() => {
                setSecondsLeft(secondsLeft - 1);
            }, 1000);

            return (): void => {
                clearTimeout(timeoutId);
            };
        }
    }, [secondsLeft]);

    React.useEffect(() => {
        let mounted = true;

        if (values.length < codeLength || values.some((v) => !v)) {
            setIsFilled(false);

            return;
        }

        onPending(true);

        if (typeof onApplyCode === 'function') {
            const code = values.join('');

            onApplyCode(code)
                .then((result) => {
                    if (!mounted) {
                        return;
                    }
                    setIsFilled(true);
                    onPending(false);
                    setIsIncorrectCode(!result);
                    if ((!result && disableAfterMistake) || result) {
                        setIsDisabled(true);
                    }
                })
                .catch(() => {
                    if (!mounted) {
                        return;
                    }
                    setIsFilled(true);
                    onPending(false);
                    setIsIncorrectCode(true);
                    if (disableAfterMistake) {
                        setIsDisabled(true);
                    }
                });
        } else {
            setIsFilled(true);
            onPending(false);
        }

        return (): void => {
            mounted = false;
        };
    }, [values, onApplyCode, refs, codeLength, disableAfterMistake, onPending]);

    const onInputClick = React.useCallback(
        (e: React.MouseEvent<HTMLInputElement>): void => {
            const index = Number(e.currentTarget.dataset.index);

            setAutoFocusIndex(index);
        },
        []
    );

    const changeHandler = React.useCallback(
        (value: string, index: number): void => {
            setIsIncorrectCode(false);
            if (!value) {
                setValues(
                    values.map((v, currentIndex) =>
                        currentIndex === index ? '' : v
                    )
                );

                return;
            }

            if (
                typeof onValidationFunc === 'function' &&
                !onValidationFunc(value)
            ) {
                return;
            }
            const filledValues = value.split('');
            const newValues = values.map((v, currentIndex) => {
                if (currentIndex < index) {
                    return v;
                }

                return filledValues[currentIndex - index] || v;
            });

            const nextIndex = index + filledValues.length;
            const el = refs[nextIndex] && refs[nextIndex].current;

            if (el) {
                el.focus();
            }

            setAutoFocusIndex(nextIndex);
            setValues(newValues);
        },
        [onValidationFunc, refs, values]
    );

    const onChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>): void => {
            const value = e.target.value;
            const index = Number(e.target.dataset.index);

            changeHandler(value, index);
        },
        [changeHandler]
    );

    const onKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>): void => {
            const keyCode = e.keyCode;
            const i = Number(e.currentTarget.dataset.index);
            const prevIndex = i - 1;
            const nextIndex = i + 1;
            const currentInput = refs[i] && refs[i].current;
            const prevInput = refs[prevIndex] ? refs[prevIndex].current : null;
            const nextInput = refs[nextIndex] ? refs[nextIndex].current : null;

            if (!currentInput) {
                return;
            }

            const KEY_CODE: Record<string, number> = {
                backspace: 8,
                left: 37,
                right: 39,
            };

            switch (keyCode) {
                case KEY_CODE.left: {
                    e.preventDefault();
                    if (prevInput) {
                        prevInput.focus();
                    }
                    break;
                }
                case KEY_CODE.right: {
                    e.preventDefault();
                    if (nextInput) {
                        nextInput.focus();
                    }
                    break;
                }
                case KEY_CODE.backspace: {
                    e.preventDefault();
                    if (currentInput.value) {
                        changeHandler('', i);
                    } else if (prevInput) {
                        prevInput.focus();
                        changeHandler('', prevIndex);
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        },
        [refs, changeHandler]
    );

    const handleSendCodeClick = React.useCallback(async (): Promise<void> => {
        if (typeof onSendCode === 'function') {
            await onSendCode();

            setValues(refs.map(() => ''));
            setIsDisabled(false);
            setSecondsLeft(timerTime);
        }
    }, [onSendCode, refs, timerTime]);

    return (
        <Flex>
            <Box mr={[null, '24px']}>
                <Flex>
                    <Flex mb="10px">
                        {refs.map((ref, i) => (
                            <Input
                                key={i}
                                ref={ref}
                                value={values[i]}
                                autoFocus={autoFocusIndex === i}
                                inputMode={inputMode}
                                onClick={onInputClick}
                                onChange={onChange}
                                onKeyDown={onKeyDown}
                                disabled={isDisabled}
                                data-index={i}
                                width="48px"
                                height="48px"
                                mr="8px"
                                pl="19px !important"
                                pr="18px !important"
                                sx={{
                                    ':last-of-type': {
                                        mr: '0',
                                    },
                                }}
                            />
                        ))}
                    </Flex>

                    {isPending && (
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            ml="24px"
                            mb="10px"
                        >
                            <DotLoader />
                        </Flex>
                    )}
                </Flex>

                {(isFilled || isDisabled) && isIncorrectCode && (
                    <Box>
                        <Text
                            fontSize="12px"
                            lineHeight="14px"
                            color="danger.$300"
                            textAlign="right"
                            display="inline-block"
                            width="100%"
                        >
                            Wrong code. Please, try again
                        </Text>
                    </Box>
                )}
            </Box>

            {isPending ||
            (isFilled && !isIncorrectCode) ||
            !onSendCode ? null : (
                <Box height="48px">
                    {secondsLeft ? (
                        <Flex
                            color="primary.$300"
                            alignItems="center"
                            flexDirection="column"
                            justifyContent="center"
                            height="100%"
                        >
                            <Text variant="body2" textAlign="center">
                                Resend code in {secondsLeft} seconds
                            </Text>
                        </Flex>
                    ) : (
                        <Button
                            variantSize="medium"
                            border="1px solid"
                            borderColor="primary.$300"
                            color="primary.$300"
                            backgroundColor="transparent"
                            px="8px !important"
                            onClick={handleSendCodeClick}
                            sx={{
                                whiteSpace: 'nowrap',
                                ':hover': {
                                    borderColor: 'primary.$500',
                                    color: 'primary.$500',
                                },
                            }}
                        >
                            Send Code
                        </Button>
                    )}
                </Box>
            )}
        </Flex>
    );
};
