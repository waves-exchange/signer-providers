import { IState } from '../interface';
import { IQueue } from '@waves.exchange/provider-ui-components';
import { preload, toQueue } from './helpers';
import { UserData } from '@waves/signer';
import login from '../router/login';

export const getLoginHandler = (
    queue: IQueue,
    state: IState
): (() => Promise<UserData>) => {
    return toQueue(queue, async () => {
        preload();

        const user = await login(state)();

        return user;
    });
};
