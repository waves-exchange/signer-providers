import {
    Box,
    Button,
    DotLoader,
    Flex,
    Heading,
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
};

export const SignInForm: FC<SignInFormProps> = ({
    signIn,
    onForgotPasswordClick,
    onSignUpClick,
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

    const handleEmailChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(event.target.value);
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
                    setErrors((prev) => ({
                        ...prev,
                        _form: e.message || JSON.stringify(e),
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
            pb="$40"
            flexDirection="column"
            justifyContent="center"
        >
            <Heading
                level={2}
                textAlign="center"
                mb="24px"
                color="standard.$0"
                fontWeight={500}
            >
                Log In with Waves.Exchange
            </Heading>

            <Box
                border="1px dashed"
                borderColor="main.$500"
                borderRadius="$4"
                mb="24px"
                p="16px"
            >
                <Text
                    fontSize="$13"
                    lineHeight="$16"
                    color="basic.$300"
                    textAlign="left"
                >
                    Don't worry! The dApp won't have access to your assets or
                    passwords
                </Text>
            </Box>

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
                            textAlign="right"
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
                    />

                    {errors.passwordRequired && (
                        <Text
                            fontSize="12px"
                            lineHeight="14px"
                            color="danger.$300"
                            textAlign="right"
                            display="inline-block"
                            width="100%"
                        >
                            {errors.passwordRequired}
                        </Text>
                    )}

                    {errors._form && (
                        <Text
                            fontSize="12px"
                            lineHeight="14px"
                            color="danger.$300"
                            textAlign="right"
                            display="inline-block"
                            width="100%"
                        >
                            {errors._form}
                        </Text>
                    )}
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

            <Flex justifyContent="space-between">
                <Button
                    color="primary.$300"
                    backgroundColor="transparent"
                    borderWidth="0"
                    onClick={onForgotPasswordClick}
                >
                    Forgot password?
                </Button>

                <Text variant="body2" color="standard.$0" textAlign="center">
                    Do not have an account?
                    <Button
                        color="primary.$300"
                        backgroundColor="transparent"
                        borderWidth="0"
                        onClick={onSignUpClick}
                    >
                        Sign Up
                    </Button>
                </Text>
            </Flex>
        </Flex>
    );
};
