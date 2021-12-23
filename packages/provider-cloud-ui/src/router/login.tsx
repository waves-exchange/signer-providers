import { UserData } from '@waves/signer';
import React from 'react';
import { IUser } from '../interface';
import { IState } from '../interface';
import renderPage from '../utils/renderPage';
import { Login } from '@waves.exchange/provider-cloud-auth';
import { utils } from '@waves.exchange/provider-ui-components';

const { analytics } = utils;

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
                            reject(new Error('User rejection!'));
                        }}
                        onConfirm={(user: IUser): void => {
                            state.user = user;

                            resolve({
                                address: user.address,
                                publicKey: user.publicKey,
                            });
                        }}
                        sendAnalytics={analytics.send.bind(analytics)}
                    />
                );
            });
        }
    };
}
