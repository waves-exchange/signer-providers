import { IQueue } from '@waves.exchange/provider-ui-components';
import { IUser } from '../interface';
import { IState } from '../interface';
import signOrder from '../router/signOrder';
import { loadUserData, preload, toQueue } from './helpers';
import { IOrderParams } from '@waves/waves-transactions';

export const getSignOrderHandler = (
    queue: IQueue,
    state: IState
): ((order: IOrderParams) => Promise<string>) =>
    toQueue(queue, (order: IOrderParams) => {
        preload();

        return loadUserData(state as IState<IUser>).then((state) =>
            signOrder(order, state)
        );
    });
