import { IQueue } from '@waves.exchange/provider-ui-components';
import { IUser, IState } from '../interface';
import signMessage from '../router/signMessage';
import { loadUserData, preload, toQueue } from './helpers';

export const getSignMessageHandler = (
    queue: IQueue,
    state: IState
): ((message: string | number) => Promise<string>) =>
    toQueue(queue, (message: string | number) => {
        preload();

        return loadUserData(state as IState<IUser>).then((state) =>
            signMessage(message, state)
        );
    });
