import {
    Box,
    Button,
    Checkbox,
    DotLoader,
    ExternalLink,
    Flex,
    Input,
    InputPassword,
    Text,
} from '@waves.exchange/react-uikit';
import React, { FC, MouseEventHandler, useCallback, useState } from 'react';
import { InputWrapper } from '../InputWrapper/InputWrapper';
import { SignUpResponse } from '../../IdentityService';
import { getEnvAwareUrl } from '../../utils/getEnvAwareUrl';

type SignUpFormProps = {
    signUp(username: string, password: string): Promise<SignUpResponse>;
    onSignInClick(): void;
    sendAnalytics?: (props?: any) => void;
};

export const SignUpForm: FC<SignUpFormProps> = ({
    signUp,
    onSignInClick,
    sendAnalytics,
}) => {
    const MIN_PASSWORD_LENGTH = 8;
    const [isPending, setPending] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | null>>({
        _form: null,
        emailRequired: null,
        passwordsDoNotMatch: null,
        passwordMinLength: null,
        passwordInsecure: null,
    });
    const [isPrivacyAccepted, setPrivacyAccepted] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');

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
                passwordsDoNotMatch: null,
                passwordMinLength: null,
                passwordInsecure: null,
            }));
        },
        []
    );

    const handlePasswordConfirmChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setPasswordConfirm(event.target.value);
            setErrors((prev) => ({
                ...prev,
                _form: null,
                passwordsDoNotMatch: null,
            }));
        },
        []
    );

    const handlePrivacyAcceptedChange = useCallback(() => {
        setPrivacyAccepted((prev) => !prev);
    }, []);

    const handleSubmit = useCallback<MouseEventHandler<HTMLButtonElement>>(
        async (event) => {
            event.preventDefault();

            try {
                setPending(true);
                await signUp(email, password);
                setPending(false);
                if (typeof sendAnalytics === 'function') {
                    sendAnalytics({ name: 'Signer_Page_SignUp_Success' });
                }
            } catch (e) {
                setPending(false);
                if (e && 'code' in e) {
                    if (e.code === 'UsernameExistsException') {
                        setErrors((prev) => ({
                            ...prev,
                            _form:
                                'This email is already registered. Log in or use another email',
                        }));
                    } else {
                        const limitExceededMessage =
                            'You have exceeded incorrect username or password limit. If you have any problems, please contact support https://support.waves.exchange/.';

                        setErrors((prev) => ({
                            ...prev,
                            _form:
                                e.message === limitExceededMessage
                                    ? 'Attempt limit exceeded, please try after some time.'
                                    : e.message,
                        }));
                    }
                } else {
                    throw e;
                }
            }
        },
        [email, password, signUp]
    );

    const handlePasswordInputBlur = useCallback(() => {
        const passwordMissedReqList: Array<string | boolean> = [
            /[a-z]/.test(password) || 'lowercase letter',
            /[A-Z]/.test(password) || 'uppercase letter',
            /[0-9]/.test(password) || 'number',
            /[$-/:-?{-~!^_`[\]@#]/.test(password) || 'special character',
        ].filter((x) => typeof x === 'string');

        setErrors((prev) => ({
            ...prev,
            passwordMinLength:
                password.length < MIN_PASSWORD_LENGTH
                    ? 'The password must be at least 8 characters long'
                    : null,
            passwordInsecure: passwordMissedReqList.length
                ? `Easy, add a ${passwordMissedReqList.join(', ')}`
                : null,
            passwordsDoNotMatch:
                password.length > 0 &&
                passwordConfirm.length > 0 &&
                passwordConfirm !== password
                    ? 'Passwords do not match'
                    : null,
        }));
    }, [passwordConfirm, password]);

    const isSubmitEnabled =
        isPrivacyAccepted &&
        Object.entries(errors).filter(([_key, value]) => Boolean(value))
            .length === 0;

    return (
        <Flex
            as="form"
            px="$40"
            pb="$30"
            flexDirection="column"
            justifyContent="center"
        >
            <Box mb="24px">
                <InputWrapper
                    mb="16px"
                    label="Enter Email"
                    labelVisible={email.length > 0}
                >
                    <Input
                        inputMode="email"
                        placeholder="Enter Email (not seed phrase)"
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
                    mb="16px"
                    label="Create Password"
                    labelVisible={password.length > 0}
                >
                    <InputPassword
                        placeholder="Create Password"
                        value={password}
                        aria-invalid={Boolean(
                            errors.passwordMinLength || errors.passwordInsecure
                        )}
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordInputBlur}
                        autoComplete="foo"
                    />

                    <Text
                        fontSize="12px"
                        lineHeight="14px"
                        color="basic.$700"
                        textAlign="left"
                        display="inline-block"
                        py="4px"
                    >
                        Password must contain numbers, special characters, upper
                        and lower case letters of the Latin alphabet and be at
                        least {MIN_PASSWORD_LENGTH} characters long
                    </Text>

                    {errors.passwordMinLength && (
                        <Text
                            fontSize="12px"
                            lineHeight="14px"
                            color="danger.$300"
                            textAlign="right"
                            display="inline-block"
                            width="100%"
                        >
                            {errors.passwordMinLength}
                        </Text>
                    )}

                    {errors.passwordInsecure && (
                        <Text
                            fontSize="12px"
                            lineHeight="14px"
                            color="danger.$300"
                            textAlign="right"
                            display="inline-block"
                            width="100%"
                        >
                            {errors.passwordInsecure}
                        </Text>
                    )}
                </InputWrapper>

                <InputWrapper
                    mb="8px"
                    label="Confirm Password"
                    labelVisible={passwordConfirm.length > 0}
                >
                    <InputPassword
                        placeholder="Confirm Password"
                        value={passwordConfirm}
                        aria-invalid={Boolean(errors.passwordsDoNotMatch)}
                        onChange={handlePasswordConfirmChange}
                        onBlur={handlePasswordInputBlur}
                        autoComplete="foo"
                    />

                    {errors.passwordsDoNotMatch && (
                        <Text
                            fontSize="12px"
                            lineHeight="12px"
                            color="danger.$300"
                            textAlign="right"
                            display="inline-block"
                            width="100%"
                        >
                            {errors.passwordsDoNotMatch}
                        </Text>
                    )}
                </InputWrapper>
            </Box>

            <Flex alignItems="center" mb="24px">
                <Checkbox
                    color="standard.$0"
                    checked={isPrivacyAccepted}
                    onChange={handlePrivacyAcceptedChange}
                >
                    <Text pl="$10" variant="body2">
                        I have read and agree with the&nbsp;
                    </Text>
                </Checkbox>
                <ExternalLink
                    href={getEnvAwareUrl(
                        '/files/Privacy_Policy_Waves.Exchange.pdf'
                    )}
                    variant="body2"
                >
                    Privacy Policy
                </ExternalLink>

                <Text variant="body2" color="standard.$0">
                    &nbsp;&amp;&nbsp;
                </Text>

                <ExternalLink
                    href={getEnvAwareUrl(
                        '/files/Terms_Of_Use_Waves.Exchange.pdf'
                    )}
                    variant="body2"
                    target="_blank"
                >
                    Terms and Conditions
                </ExternalLink>
            </Flex>

            {errors._form && (
                <Box mb="24px">
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
                </Box>
            )}

            <Button
                type="submit"
                variant="primary"
                variantSize="medium"
                mb="24px"
                onClick={handleSubmit}
                disabled={!isSubmitEnabled}
            >
                {isPending ? (
                    <Flex justifyContent="center" alignItems="center">
                        <DotLoader />
                    </Flex>
                ) : (
                    <Text>Create Account</Text>
                )}
            </Button>

            <Text variant="body2" color="standard.$0" textAlign="center">
                Already have an account?
                <Button
                    color="primary.$300"
                    backgroundColor="transparent"
                    borderWidth="0"
                    onClick={onSignInClick}
                >
                    Log In
                </Button>
            </Text>
        </Flex>
    );
};
