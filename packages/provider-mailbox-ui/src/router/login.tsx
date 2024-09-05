import React from 'react';
import renderPage from '../utils/renderPage';
import { Login } from '../pages/Login/Login';
import { UserData as SignerUserData } from '@waves/signer';
import { IState, IUser } from '../interface';
import { ERROR } from '../constants/constants';

export interface UserData extends SignerUserData {
    isSignAndBroadcastByProvider?: boolean;
}

export default function (state: IState): () => Promise<UserData> {
    return (): Promise<UserData> => {
        if (state.user !== null) {
            return Promise.resolve({
                address: state.user.address,
                publicKey: state.user.publicKey,
                isSignAndBroadcastByProvider:
                    state.user.isSignAndBroadcastByProvider ?? false,
            });
        } else {
            return new Promise((resolve, reject) => {
                renderPage(
                    <Login
                        mailboxListener={state.mailboxListener}
                        onCancel={(): void => {
                            reject(new Error(ERROR.USER_REJECT));
                        }}
                        onConfirm={(user: IUser): void => {
                            state.user = user;

                            resolve({
                                address: user.address,
                                publicKey: user.publicKey,
                                isSignAndBroadcastByProvider:
                                    user.isSignAndBroadcastByProvider ?? false,
                            });
                        }}
                    />
                );
            });
        }
    };
}
