import React, {
    FC,
    MouseEventHandler,
    useCallback,
    useState,
    useEffect,
} from 'react';
import { IUser } from '../../interface';
import { LoginComponent } from './LoginComponent';
import { getUsers, addSeedUser, StorageUser } from '../../services/userService';
import { libs } from '@waves/waves-transactions';
import { SelectAccountComponent } from './SelectAccountComponent';
import {
    IStorageTransferData,
    utils,
} from '@waves.exchange/provider-ui-components';
import { storage } from '../../services/storage';
import { pseudoStorage } from '../../services/pseudoStorage';

interface IProps {
    networkByte: number;
    onConfirm: (user: IUser) => void;
    onCancel: () => void;
    isIncognito: boolean;
    publicUserData?: IStorageTransferData;
}

export const Login: FC<IProps> = ({
    networkByte,
    onConfirm,
    onCancel,
    isIncognito,
    publicUserData,
}) => {
    const [errorMessage, setErrorMessage] = useState<string>();
    const [currentUser, setCurrentUser] = useState<StorageUser>();
    const [users, setUsers] = useState<StorageUser[]>();
    const [password, setPassword] = useState<string>('');

    const inputPasswordId = 'password';

    const handlePasswordChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            setErrorMessage(undefined);
            setPassword(event.target.value);
        },
        []
    );

    const handleClose = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        onCancel();
    }, [onCancel]);

    if (publicUserData) {
        Object.entries(publicUserData).forEach(([key, val]) => {
            pseudoStorage.setItem(key, val);
        });
        storage.setStorageOrigin(pseudoStorage);
    }

    const handleLogin = useCallback<MouseEventHandler<HTMLButtonElement>>(
        (e) => {
            e.preventDefault();

            const { resolveData: users } = getUsers(password, networkByte);

            if (users) {
                utils.analytics.send({ name: 'Signer_Page_SignIn_Success' });

                if (users.length === 1) {
                    onConfirm(users[0]);

                    utils.analytics.addDefaultParams({
                        userType: users[0].userType,
                    });
                } else if (users.length > 1) {
                    setUsers(users);
                } else {
                    const user = addSeedUser(
                        libs.crypto.randomSeed(15),
                        password,
                        networkByte
                    );

                    if (!user.ok) {
                        setErrorMessage('Unknown error');

                        return;
                    }

                    onConfirm({
                        address: libs.crypto.address(
                            user.resolveData.seed,
                            user.resolveData.networkByte
                        ),
                        privateKey: libs.crypto.privateKey(
                            user.resolveData.seed
                        ),
                    });
                }
            } else {
                setErrorMessage('Incorrect password');
            }
        },
        [networkByte, onConfirm, password, publicUserData]
    );

    const handleUserChange = useCallback(
        (user: StorageUser): void => {
            setCurrentUser(user);
        },
        [setCurrentUser]
    );

    const handleContinue = useCallback<MouseEventHandler<HTMLButtonElement>>(
        (e) => {
            e.preventDefault();
            currentUser && onConfirm(currentUser);

            utils.analytics.addDefaultParams({
                userType: currentUser?.userType,
            });
        },
        [currentUser, onConfirm]
    );

    useEffect(() => {
        if (!currentUser && Array.isArray(users) && users.length > 0) {
            handleUserChange(users[0]);
        }
    }, [currentUser, handleUserChange, users]);

    const hasMultipleUsers = users && users.length > 1;
    const isSubmitDisabled = !password || !password.length || !!errorMessage;
    const title = hasMultipleUsers ? 'Select Account' : 'Log In';

    return (
        <LoginComponent
            title={title}
            errorMessage={errorMessage}
            showNotification={!hasMultipleUsers}
            inputPasswordId={inputPasswordId}
            onClose={handleClose}
            onLogin={handleLogin}
            password={password}
            onPasswordChange={handlePasswordChange}
            isSubmitDisabled={isSubmitDisabled}
            isIncognito={isIncognito}
        >
            {hasMultipleUsers ? (
                <SelectAccountComponent
                    networkByte={networkByte}
                    onUserChange={handleUserChange}
                    users={users}
                    currentUser={currentUser}
                    onContinue={handleContinue}
                />
            ) : null}
        </LoginComponent>
    );
};
