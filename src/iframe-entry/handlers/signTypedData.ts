import { IUser } from '../../interface';
import { IQueue } from '../../utils/Queue';
import { IState } from '../interface';
import { loadUserData, preload, toQueue } from './helpers';
import signTypedData from '../router/signTypedData';
import { TypedData } from '@waves/signer';

export const getSignTypedDataHandler = (
    queue: IQueue,
    state: IState
): ((data: Array<TypedData>) => Promise<string>) =>
    toQueue(queue, (data: Array<TypedData>) => {
        preload();

        return loadUserData(state as IState<IUser>).then((state) =>
            signTypedData(data, state)
        );
    });
