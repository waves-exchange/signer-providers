import { IUser } from '../interface';
import { IState } from '../interface';
import signMessage from '../router/signMessage';
import { loadUserData, preload, toQueue } from './helpers';
import { IQueue } from '@waves.exchange/provider-ui-components';

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
