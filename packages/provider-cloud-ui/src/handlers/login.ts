import { UserData } from '@waves/signer';
import { libs } from '@waves/waves-transactions';
import { pipe } from 'ramda';
import { IQueue } from '../utils/Queue';
import { IState } from '../interface';
import login from '../router/login';
import { loadConfig } from '../services/configService';
import { analytics } from '../utils/analytics';
import { preload, toQueue } from './helpers';

export const getLoginHandler = (
    queue: IQueue,
    state: IState
): (() => Promise<UserData>) => {
    return toQueue(queue, async () => {
        preload();

        const config = await loadConfig(state.networkByte);

        state.identity.configure({
            apiUrl: config.identity.apiUrl,
            clientId: config.identity.cognito.clientId,
            userPoolId: config.identity.cognito.userPoolId,
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
