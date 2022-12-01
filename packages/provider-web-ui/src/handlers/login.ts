import { UserData } from '@waves/signer';
import { Bus, WindowAdapter, WindowProtocol } from '@waves/waves-browser-bus';
import { libs } from '@waves/waves-transactions';
import { pipe } from 'ramda';
import { IState } from '../interface';
import login from '../router/login';
import { IQueue, utils, TBus } from '@waves.exchange/provider-ui-components';
import { preload, toQueue } from './helpers';

const { analytics, isSafari, isBrave } = utils;
const isOpenWindow = window.location.search.includes('openWindow=true'); // is new provider's version used, that used window.open
const isTransferWindow = window.location.search.includes('transferWindow=true');

export const getLoginHandler = (
    queue: IQueue,
    state: IState
): (() => Promise<UserData>) =>
    toQueue(queue, () => {
        preload();

        if (
            window.top !== window &&
            !isTransferWindow &&
            (isSafari() || isBrave() || isOpenWindow)
        ) {
            const loginAndClose = (
                bus: TBus,
                resolve: (userData: UserData) => void,
                reject: (err: Error) => void
            ): void => {
                bus.dispatchEvent('connect', {
                    NODE_URL: state.nodeUrl,
                    NETWORK_BYTE: state.networkByte,
                });

                bus.request('login', void 0, -1)
                    .then((res) => {
                        window['__loginWindow'].close();
                        bus.destroy();
                        resolve(res);
                    })
                    .catch((err: Error) => {
                        window['__loginWindow'].close();
                        bus.destroy();
                        reject(err);
                    });
            };

            const adapter = new WindowAdapter(
                [
                    new WindowProtocol(
                        window,
                        WindowProtocol.PROTOCOL_TYPES.LISTEN
                    ),
                ],
                []
            );
            const bus = new Bus(adapter);

            return new Promise((resolve, reject) => {
                bus.once('ready', () => {
                    const loginBus = new Bus(
                        new WindowAdapter(
                            [
                                new WindowProtocol(
                                    window,
                                    WindowProtocol.PROTOCOL_TYPES.LISTEN
                                ),
                            ],
                            [
                                new WindowProtocol(
                                    window['__loginWindow'],
                                    WindowProtocol.PROTOCOL_TYPES.DISPATCH
                                ),
                            ]
                        )
                    );

                    loginAndClose(loginBus, resolve, reject);
                });

                bus.once('close', () => {
                    bus.destroy();
                    reject('Window was closed by user');
                });
            });
        } else {
            return login(state)().then((user) => {
                if (window.opener) {
                    window.opener['__setUser'](state.user);
                }

                analytics.addDefaultParams({
                    auuid: pipe(
                        libs.crypto.stringToBytes,
                        libs.crypto.blake2b,
                        libs.crypto.base64Encode
                    )(user.address),
                });

                return user;
            });
        }
    });
