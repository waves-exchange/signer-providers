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

    const handleConnect = React.useCallback((): void => {
        const id = convertBase32ToId(code);

        mailboxListener.connect(id, {
            onCreate: () => {
                mailboxListener.setCode(code);
                mailboxListener.generatePair();
            },
            onMsg: (message: TReceivedMsg) => {
                if (message.resp === 'pk') {
                    mailboxListener.onGetWXNPk(message);
                    const imgSrc = mailboxListener.idIconSrc;

                    setImgSrc(imgSrc);
                    setState('connected');
                }
                // if (message.resp === 'success') {
                //   onSuccess(message);
                // }
                // if (message.resp === 'declined') {
                //     setState('error');
                //     setError(message.value.error);
                // }
                if (message.resp === 'ready') {
                    setState('waitingLogIn');
                    mailboxListener.setConnectionIsReady();
                }
                if (message.resp === 'userData') {
                    mailboxListener.setConnectionIsReady();
                    onConfirm({
                        address: message.value.address,
                        publicKey: message.value.publicKey,
                    });
                }
            },
            onClose: () => {
                setState('error');
                setError('Something went wrong. Try again');
            },
            onError: (e) => {
                setState('error');
                setError(JSON.stringify(e));
            },
        });
    }, [code, mailboxListener, onConfirm]);

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
                    Create Mailbox Connection and LogIn
                </Text>
                <IconButton
                    ml="auto"
                    size={25}
                    color="basic.$700"
                    _hover={{ color: 'basic.$500' }}
                    onClick={onCancel}
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
                            return <Error error={error} />;
                        case 'connected':
                            return <Identicon imgSrc={imgSrc} />;
                        case 'waitingLogIn':
                            return <WaitingForLogIn />;
                        case 'initial':
                        default:
                            return (
                                <>
                                    <Input
                                        value={code}
                                        onChange={(e) =>
                                            setCode((e.target as any).value)
                                        }
                                        placeholder="Enter code from WX.Network"
                                    />
                                    <Button
                                        variant="primary"
                                        variantSize="medium"
                                        width="100%"
                                        mt={20}
                                        onClick={handleConnect}
                                    >
                                        Connect
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
