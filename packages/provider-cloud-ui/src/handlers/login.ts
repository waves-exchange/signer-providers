import { UserData } from '@waves/signer';
import { libs } from '@waves/waves-transactions';
import { pipe } from 'ramda';
import { IState } from '../interface';
import login from '../router/login';
import { loadConfig } from '../services/configService';
import { IQueue, TBus, utils } from '@waves.exchange/provider-ui-components';
import { preload, toQueue } from './helpers';
import { Bus, WindowAdapter, WindowProtocol } from '@waves/waves-browser-bus';

const { analytics, isSafari, isBrave } = utils;

export const getLoginHandler = (
    queue: IQueue,
    state: IState
): (() => Promise<UserData>) => {
    return toQueue(queue, async () => {
        preload();

        if (window.top !== window && (isSafari() || isBrave())) {
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

            return new Promise<UserData>((resolve, reject) => {
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
            const config = await loadConfig(state.networkByte);

            state.identity.configure({
                apiUrl: config.identity.apiUrl,
                clientId: config.identity.cognito.clientId,
                userPoolId: config.identity.cognito.userPoolId,
                endpoint: config.identity.cognito.endpoint,
                geetestUrl: config.identity.geetest.url,
            });

            const user = await login(state)();

            analytics.addDefaultParams({
                auuid: pipe(
                    libs.crypto.stringToBytes,
                    libs.crypto.blake2b,
                    libs.crypto.base64Encode
                )(user.address),
            });

            return user;
        }
    });
};
