import {
    AuthChallenge,
    CodeDelivery,
    IdentityService,
    SignUpResponse,
    getRecaptureToken,
} from '../../services/IdentityService';
import {
    Box,
    Flex,
    Icon,
    IconButton,
    iconClose,
    iconExpandAccordion,
    iconLogo,
} from '@waves.exchange/react-uikit';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { CodeConfirmation } from '../../components/Auth/CodeConfirmation';
import { ForgotPassword } from '../../components/Auth/ForgotPassword';
import { IUser } from '../../interface';
import { SignInForm } from '../../components/Auth/SignInForm';
import { SignUpForm } from '../../components/Auth/SignUpForm';

type LoginStateType =
    | 'sign-up'
    | 'sign-in'
    | 'confirm-sign-up'
    | 'confirm-sign-in'
    | 'forgot-password';

type LoginProps = {
    identity: IdentityService;
    onConfirm(user: IUser): void;
    onCancel(): void;
};

export const Login: FC<LoginProps> = ({ identity, onConfirm, onCancel }) => {
    const [loginState, setLoginState] = useState<LoginStateType>('sign-in');
    const [codeDelivery, setCodeDelivery] = useState<CodeDelivery>();
    const userData = useRef<{ username: string; password: string }>();

    const handleSuccess = useCallback(() => {
        onConfirm({
            address: identity.getUserAddress(),
            publicKey: identity.getUserPublicKey(),
        });
    }, [identity, onConfirm]);

    const resendSignUp = useCallback(async (): Promise<void> => {
        const result = await identity.resendSignUp();

        setCodeDelivery(result);
        setLoginState('confirm-sign-up');
    }, [identity]);

    const signIn = useCallback(
        async (username: string, password: string): Promise<void> => {
            try {
                const cognitoUser = await identity.signIn(username, password);

                const challengeName: AuthChallenge | void =
                    cognitoUser.challengeName;

                switch (challengeName) {
                    case 'SMS_MFA':
                        // TODO ???
                        setCodeDelivery({ type: 'SMS', destination: '' });
                        setLoginState('confirm-sign-in');
                        break;
                    case 'SOFTWARE_TOKEN_MFA':
                        setCodeDelivery({
                            type: 'TOTP',
                            destination: 'TOTP device',
                        });
                        setLoginState('confirm-sign-in');
                        break;
                    default:
                        handleSuccess();
                }
            } catch (e) {
                if (e && e.code === 'UserNotConfirmedException') {
                    userData.current = { username, password };
                    await resendSignUp();
                } else {
                    throw e;
                }
            }
        },
        [handleSuccess, identity, resendSignUp]
    );

    const signUp = useCallback(
        async (username: string, password: string): Promise<SignUpResponse> => {
            const meta = Object.create(null);

            try {
                meta.token = await getRecaptureToken('SIGN_UP');
            } catch (e) {
                meta.token = undefined;
            }
            const result = await identity.signUp(username, password, meta);

            userData.current = {
                username,
                password,
            };

            if (result.userConfirmed === true) {
                await signIn(
                    userData.current.username,
                    userData.current.password
                );
                handleSuccess();
            } else {
                setCodeDelivery({
                    type: result.codeDeliveryDetails.DeliveryMedium,
                    destination: result.codeDeliveryDetails.Destination,
                });
                setLoginState('confirm-sign-up');
            }

            return result;
        },
        [handleSuccess, identity, signIn]
    );

    const confirmSignUp = useCallback(
        async (code: string): Promise<void> => {
            await identity.confirmSignUp(code);

            if (userData.current) {
                await signIn(
                    userData.current.username,
                    userData.current.password
                );
            }

            handleSuccess();
        },
        [handleSuccess, identity, signIn]
    );

    const confirmSignIn = useCallback(
        async (code: string): Promise<void> => {
            try {
                await identity.confirmSignIn(
                    code,
                    codeDelivery?.type === 'SMS'
                        ? 'SMS_MFA'
                        : 'SOFTWARE_TOKEN_MFA'
                );

                handleSuccess();
            } catch (e) {
                if (
                    e &&
                    e.code === 'NotAuthorizedException' &&
                    userData.current
                ) {
                    await signIn(
                        userData.current.username,
                        userData.current.password
                    );
                } else {
                    throw e;
                }
            }
        },
        [codeDelivery, handleSuccess, identity, signIn]
    );

    const resendSignIn = useCallback(async (): Promise<void> => {
        if (userData.current) {
            await signIn(userData.current.username, userData.current.password);
        }
    }, [signIn]);

    useEffect(() => {
        if (
            loginState !== 'confirm-sign-up' &&
            loginState !== 'confirm-sign-in'
        ) {
            setCodeDelivery(undefined);
        }
    }, [loginState]);

    return (
        <Box bg="main.$800" width="520px" borderRadius="$6">
            <Flex height={65}>
                {(loginState === 'confirm-sign-up' ||
                    loginState === 'confirm-sign-in') && (
                    <IconButton
                        size={56}
                        color="basic.$700"
                        _hover={{ color: 'basic.$500' }}
                        onClick={(): void => {
                            if (loginState === 'confirm-sign-up') {
                                setLoginState('sign-up');
                            }

                            if (loginState === 'confirm-sign-in') {
                                setLoginState('sign-in');
                            }
                        }}
                    >
                        <Icon
                            icon={iconExpandAccordion}
                            size={20}
                            sx={{ transform: 'rotate(90deg)' }}
                        />
                    </IconButton>
                )}

                <IconButton
                    ml="auto"
                    size={56}
                    color="basic.$700"
                    _hover={{ color: 'basic.$500' }}
                    onClick={onCancel}
                >
                    <Icon icon={iconClose} />
                </IconButton>
            </Flex>

            <Icon
                display="block"
                mx="auto"
                mb="24px"
                size={80}
                icon={iconLogo}
            />

            {loginState === 'sign-in' && (
                <SignInForm
                    signIn={signIn}
                    onForgotPasswordClick={(): void => {
                        setLoginState('forgot-password');
                    }}
                    onSignUpClick={(): void => {
                        setLoginState('sign-up');
                    }}
                />
            )}

            {loginState === 'sign-up' && (
                <SignUpForm
                    signUp={signUp}
                    onSignInClick={(): void => {
                        setLoginState('sign-in');
                    }}
                />
            )}

            {loginState === 'confirm-sign-up' && (
                <CodeConfirmation
                    codeDelivery={codeDelivery}
                    confirmCode={confirmSignUp}
                    resendCode={resendSignUp}
                />
            )}

            {loginState === 'confirm-sign-in' && (
                <CodeConfirmation
                    codeDelivery={codeDelivery}
                    confirmCode={confirmSignIn}
                    resendCode={
                        codeDelivery?.type === 'SMS' ? resendSignIn : undefined
                    }
                />
            )}

            {loginState === 'forgot-password' && (
                <ForgotPassword
                    onSignInClick={(): void => {
                        setLoginState('sign-in');
                    }}
                    onSignUpClick={(): void => {
                        setLoginState('sign-up');
                    }}
                />
            )}
        </Box>
    );
};
