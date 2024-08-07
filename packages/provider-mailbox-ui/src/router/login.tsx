import React from 'react';
import renderPage from '../utils/renderPage';
import { Login } from '../pages/Login/Login';
import { UserData } from '@waves/signer';
import { IState, IUser } from '../interface';

export default function (state: IState): () => Promise<UserData> {
    return (): Promise<UserData> => {
        if (state.user !== null) {
            return Promise.resolve({
                address: state.user.address,
                publicKey: state.user.publicKey,
            });
        } else {
            return new Promise((resolve, reject) => {
                renderPage(
                    <Login
                        mailboxListener={state.mailboxListener}
                        onCancel={(): void => {
                            reject(new Error('User rejection!'));
                        }}
                        onConfirm={(user: IUser): void => {
                            state.user = user;

                            resolve({
                                address: user.address,
                                publicKey: user.publicKey,
                            });
                        }}
                    />
                );
            });
        }
    };
}
