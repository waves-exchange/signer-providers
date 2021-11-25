import {
    Box,
    Button,
    DotLoader,
    Flex,
    Input,
    InputPassword,
    Text,
} from '@waves.exchange/react-uikit';
import React, {
    FC,
    MouseEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { InputWrapper } from '../InputWrapper/InputWrapper';

type SignInFormProps = {
    signIn(username: string, password: string): Promise<void>;
    onForgotPasswordClick(): void;
    onSignUpClick(): void;
    signUpEmail?: string;
};

export const SignInForm: FC<SignInFormProps> = ({
    signIn,
    onForgotPasswordClick,
    onSignUpClick,
    signUpEmail,
}) => {
    const [pending, setPenging] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string | null>>({
        _form: null,
        emailRequired: null,
        passwordRequired: null,
    });
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const mounted = useRef<boolean>(false);

    useEffect(() => {
        if (signUpEmail) {
            setEmail(signUpEmail);
        }
    }, [signUpEmail]);

    const handleEmailChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(event.target.value.trim());
            setErrors((prev) => ({
                ...prev,
                _form: null,
                emailRequired: null,
            }));
        },
        []
    );

    const handleEmailBlur = useCallback(() => {
        setErrors((prev) => ({
            ...prev,
            emailRequired:
                email.length === 0 || /.+@.+\..+/.test(email) === false
                    ? 'Enter correct email'
                    : null,
        }));
    }, [email]);

    const handlePasswordChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value);
            setErrors((prev) => ({
                ...prev,
                _form: null,
                passwordRequired: null,
            }));
        },
        []
    );

    const handlePasswordBlur = useCallback(() => {
        setErrors((prev) => ({
            ...prev,
            passwordRequired: password.length === 0 ? 'Enter password' : null,
        }));
    }, [password.length]);

    const handleSubmit = useCallback<MouseEventHandler>(
        async (event) => {
            event.preventDefault();

            setPenging(true);

            try {
                await signIn(email, password);
            } catch (e) {
                if (e) {
                    const limitExceededMessage =
                        'You have exceeded incorrect username or password limit. If you have any problems, please contact support https://support.waves.exchange/.';

                    setErrors((prev) => ({
                        ...prev,
                        _form:
                            e.message === limitExceededMessage
                                ? 'Attempt limit exceeded, please try after some time.'
                                : e.message || JSON.stringify(e),
                    }));
                }
            } finally {
                if (mounted.current) {
                    setPenging(false);
                }
            }
        },
        [email, password, signIn]
    );

    useEffect(() => {
        mounted.current = true;

        return (): void => {
            mounted.current = false;
        };
    });

    const isSubmitEnabled =
        Object.entries(errors).filter(([_key, value]) => Boolean(value))
            .length === 0;

    return (
        <Flex
            as="form"
            px="$40"
            pb="24px"
            flexDirection="column"
            justifyContent="center"
        >
            <Box mb="24px">
                <InputWrapper
                    mb="16px"
                    label="Email"
                    labelVisible={email.length > 0}
                >
                    <Input
                        inputMode="email"
                        placeholder="Email"
                        value={email}
                        autoFocus={true}
                        aria-invalid={Boolean(errors.emailRequired)}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                    />

                    {errors.emailRequired && (
                        <Text
                            fontSize="12px"
                            lineHeight="14px"
                            color="danger.$300"
                            textAlign="left"
                            display="inline-block"
                            width="100%"
                        >
                            {errors.emailRequired}
                        </Text>
                    )}
                </InputWrapper>

                <InputWrapper
                    mb="8px"
                    label="Password"
                    labelVisible={password.length > 0}
                >
                    <InputPassword
                        placeholder="Password"
                        value={password}
                        aria-invalid={Boolean(errors.passwordRequired)}
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                        autoComplete="foo"
                    />

                    <Box mt="8px">
                        {errors.passwordRequired && (
                            <Text
                                fontSize="13px"
                                lineHeight="16px"
                                color="danger.$300"
                                textAlign="right"
                                display="inline-block"
                            >
                                {errors.passwordRequired}
                            </Text>
                        )}

                        {errors._form && (
                            <Text
                                fontSize="13px"
                                lineHeight="16px"
                                color="danger.$300"
                                textAlign="right"
                                display="inline-block"
                            >
                                {errors._form}
                            </Text>
                        )}

                        <Button
                            sx={{ float: 'right' }}
                            p="0"
                            fontSize="13px"
                            lineHeight="16px"
                            color="primary.$300"
                            backgroundColor="transparent"
                            borderWidth="0"
                            onClick={onForgotPasswordClick}
                        >
                            Forgot password?
                        </Button>
                    </Box>
                </InputWrapper>
            </Box>

            <Button
                type="submit"
                variant="primary"
                variantSize="medium"
                mb="24px"
                onClick={handleSubmit}
                disabled={pending || !isSubmitEnabled}
            >
                {pending ? (
                    <Flex justifyContent="center" alignItems="center">
                        <DotLoader />
                    </Flex>
                ) : (
                    <Text>Log In</Text>
                )}
            </Button>

            <Box textAlign="center">
                <Text
                    variant="body2"
                    color="standard.$0"
                    textAlign="center"
                    display="block"
                    mb="10px"
                    lineHeight="16px"
                    fontWeight={300}
                >
                    Do not have an account?
                </Text>
                <Button
                    width="124px"
                    bg="transparent"
                    color="primary.$300"
                    border="1px solid"
                    borderColor="primary.$300"
                    variantSize="small"
                    height="32px"
                    onClick={onSignUpClick}
                >
                    Sign Up
                </Button>
            </Box>
        </Flex>
    );
};
