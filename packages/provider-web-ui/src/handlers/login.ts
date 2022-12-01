import { UserData } from '@waves/signer';
import { Bus, WindowAdapter, WindowProtocol } from '@waves/waves-browser-bus';
import { libs } from '@waves/waves-transactions';
import { pipe } from 'ramda';
import { IState } from '../interface';
import login from '../router/login';
import { IQueue, utils, TBus } from '@waves.exchange/provider-ui-components';
import { preload, toQueue } from './helpers';
import { IStorageTransferData } from './getData';

const { analytics, isSafari, isBrave } = utils;
const isOpenWindow = window.location.search.includes('openWindow=true'); // is new provider's version used, that used window.open

export const getLoginHandler = (
    queue: IQueue,
    state: IState
): ((publicUserData: IStorageTransferData) => Promise<UserData>) =>
    toQueue(queue, (publicUserData) => {
        preload();
        console.log('PRELOAD');

        return login({ ...state, publicUserData: publicUserData })().then(
            (user) => {
                analytics.addDefaultParams({
                    auuid: pipe(
                        libs.crypto.stringToBytes,
                        libs.crypto.blake2b,
                        libs.crypto.base64Encode
                    )(user.address),
                });

                return user;
            }
        );
    });
