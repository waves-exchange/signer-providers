import { IQueue } from '@waves.exchange/provider-ui-components';
import { IUser } from '../interface';
import { IState } from '../interface';
import signTypedData from '../router/signTypedData';
import { loadUserData, preload, toQueue } from './helpers';
import {
    DataTransactionEntry,
    DataTransactionDeleteRequest,
} from '@waves/ts-types';

type TDataEntry = Exclude<DataTransactionEntry, DataTransactionDeleteRequest>;

export const getSignTypedDataHandler = (
    queue: IQueue,
    state: IState
): ((data: Array<TDataEntry>) => Promise<string>) =>
    toQueue(queue, (data: Array<TDataEntry>) => {
        preload();

        return loadUserData(state as IState<IUser>).then((state) =>
            signTypedData(data, state)
        );
    });
