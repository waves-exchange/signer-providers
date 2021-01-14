import { IUser } from '../../interface';
import { IQueue } from '../../utils/Queue';
import { IState } from '../interface';
import { loadUserData, preload, toQueue } from './helpers';
import signTypedData from '../router/signTypedData';
import { ITypedData } from '@waves/signer';

export const getSignTypedDataHandler = (
    queue: IQueue,
    state: IState
): ((data: Array<ITypedData>) => Promise<string>) =>
    toQueue(queue, (data: Array<ITypedData>) => {
        preload();

        return loadUserData(state as IState<IUser>).then((state) =>
            signTypedData(data, state)
        );
    });
