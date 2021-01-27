import { UserData } from '@waves/signer';
import React from 'react';
import { IUser } from '../interface';
import { IState } from '../interface';
import { Login } from '../pages/Login/Login';
import renderPage from '../utils/renderPage';

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
                        identity={state.identity}
                        onCancel={(): void => {
                            reject('User rejection!');
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
