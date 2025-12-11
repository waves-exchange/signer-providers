import { IQueue, TOrderArgs } from '@waves.exchange/provider-ui-components';
import { IUser } from '../interface';
import { IState } from '../interface';
import signOrder from '../router/signOrder';
import { loadUserData, preload, toQueue } from './helpers';

export const getSignOrderHandler = (
    queue: IQueue,
    state: IState
): ((order: TOrderArgs) => Promise<string>) =>
    toQueue(queue, (order: TOrderArgs) => {
        preload();

        return loadUserData(state as IState<IUser>).then((state) =>
            signOrder(order, state)
        );
    });
