import { UserData } from '@waves/signer';
import { libs } from '@waves/waves-transactions';
import { pipe } from 'ramda';
import { IState } from '../interface';
import login from '../router/login';
import { loadConfig } from '../services/configService';
import { IQueue, utils } from '@waves.exchange/provider-ui-components';
import { preload, toQueue } from './helpers';

const { analytics } = utils;

export const getLoginHandler = (
    queue: IQueue,
    state: IState
): (() => Promise<UserData>) => {
    return toQueue(queue, async () => {
        preload();
        const config = await loadConfig(state.networkByte, state.env);

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
    });
};
