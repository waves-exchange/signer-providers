import React from 'react';
import { IUser } from '../../interface';
import { MailboxWXNListener } from '../../services';
import { TReceivedMsg } from '../../services/mailbox/interface';
import { convertBase32ToId } from '../../utils/convertBase32ToId';
import {
    Box,
    Flex,
    IconButton,
    Icon,
    iconClose,
    Text,
    Input,
    Button,
    ExternalLink,
} from '@waves.exchange/react-uikit';
import { Error } from './Error';
import { Identicon } from './Identicon';
import { WaitingForLogIn } from './WaitingLogIn';

interface IConnectPageProps {
    mailboxListener: MailboxWXNListener;
    onCancel: () => void;
    onConfirm: (user: IUser) => void;
}

type TState = 'initial' | 'error' | 'connected' | 'waitingLogIn';

export const Login: React.FC<IConnectPageProps> = ({
    mailboxListener,
    onCancel,
    onConfirm,
}) => {
    const [state, setState] = React.useState<TState>('initial');
    const [code, setCode] = React.useState<string>('');
    const [imgSrc, setImgSrc] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');
    const [isPending, setIsPending] = React.useState<boolean>(false);

    const onCreate = React.useCallback(() => {
        setIsPending(true);
        mailboxListener.setCode(code);
        mailboxListener.generatePair();
    }, [code, mailboxListener]);

    const onClose = React.useCallback(() => {
        setState('error');
        setError(
            'Connection was closed. Please, update code on the WX.Network and try again.'
        );
    }, []);

    const onError = React.useCallback((e) => {
        setState('error');
        setError(JSON.stringify(e));
    }, []);

    const onMsg = React.useCallback(
        (message: TReceivedMsg) => {
            if (message.resp === 'pk') {
                mailboxListener.onGetWXNPk(message);
                const imgSrc = mailboxListener.idIconSrc;

                setImgSrc(imgSrc);
                setState('connected');
                setIsPending(false);
            }
            if (message.resp === 'ready') {
                setState('waitingLogIn');
                mailboxListener.setConnectionIsReady();
            }
            if (message.resp === 'userData') {
                mailboxListener.setConnectionIsReady();
                onConfirm({
                    address: message.value.address,
                    publicKey: message.value.publicKey,
                    name: message.value.name || 'WX.Network Account',
                });
                mailboxListener.removeCb('onCreate', onCreate);
                mailboxListener.removeCb('onMsg', onMsg);
                mailboxListener.removeCb('onClose', onClose);
                mailboxListener.removeCb('onError', onError);
            }
        },
        [mailboxListener, onConfirm, onCreate, onClose, onError]
    );

    const handleConnect = React.useCallback((): void => {
        const id = convertBase32ToId(code);

        mailboxListener.addCb('onCreate', onCreate);
        mailboxListener.addCb('onMsg', onMsg);
        mailboxListener.addCb('onClose', onClose);
        mailboxListener.addCb('onError', onError);

        mailboxListener.connect(id);
    }, [code, mailboxListener, onCreate, onMsg, onClose, onError]);

    const handleClose = React.useCallback((): void => {
        mailboxListener.removeCb('onCreate', onCreate);
        mailboxListener.removeCb('onMsg', onMsg);
        mailboxListener.removeCb('onClose', onClose);
        mailboxListener.removeCb('onError', onError);
        onCancel();
    }, [onCancel, onCreate, onClose, onError, onMsg, mailboxListener]);

    const onTryAgain = React.useCallback((): void => {
        setState('initial');
        setError('');
        setCode('');
        setImgSrc('');
        mailboxListener.removeCb('onCreate', onCreate);
        mailboxListener.removeCb('onMsg', onMsg);
        mailboxListener.removeCb('onClose', onClose);
        mailboxListener.removeCb('onError', onError);
    }, [onCreate, onClose, onError, onMsg, mailboxListener]);

    return (
        <Box bg="main.$800" width={520} borderRadius="$6">
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
                    Create Mailbox Connection and Log In
                </Text>
                <IconButton
                    ml="auto"
                    size={25}
                    color="basic.$700"
                    _hover={{ color: 'basic.$500' }}
                    onClick={handleClose}
                >
                    <Icon icon={iconClose} />
                </IconButton>
            </Flex>
            <Flex
                px="$40"
                pb="$40"
                flexDirection="column"
                justifyContent="center"
            >
                {(() => {
                    switch (state) {
                        case 'error':
                            return (
                                <Error error={error} onTryAgain={onTryAgain} />
                            );
                        case 'connected':
                            return <Identicon imgSrc={imgSrc} />;
                        case 'waitingLogIn':
                            return <WaitingForLogIn />;
                        case 'initial':
                        default:
                            return (
                                <>
                                    <Text
                                        variant="body1"
                                        color="standard.$0"
                                        display="inline-block"
                                        mb={16}
                                    >
                                        Open{' '}
                                        <ExternalLink href="https://wx.network?openMailboxProviderConnection">
                                            WX.Network
                                        </ExternalLink>{' '}
                                        domain and create connection. Enter the
                                        code generated on the WX.Network domain
                                        tab to continue login.
                                    </Text>
                                    <Text
                                        variant="body1"
                                        color="warning.$500"
                                        display="inline-block"
                                        mb={16}
                                    >
                                        Please do not close this tab until the
                                        login is completed!
                                    </Text>
                                    <Input
                                        value={code}
                                        onChange={(e) =>
                                            setCode((e.target as any).value)
                                        }
                                        placeholder="Enter the code from WX.Network"
                                    />
                                    <Button
                                        variant="primary"
                                        variantSize="medium"
                                        width="100%"
                                        mt={20}
                                        onClick={handleConnect}
                                        disabled={code === '' || isPending}
                                    >
                                        {isPending ? '...' : 'Continue'}
                                    </Button>
                                </>
                            );
                    }
                })()}
                <Box pt="24px" textAlign="center" fontWeight={300}>
                    <Text variant="footnote1" color="basic.$500">
                        WX.Network
                    </Text>
                    <Text variant="footnote1" color="basic.$700">
                        {' '}
                        provider is used.{' '}
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
};
