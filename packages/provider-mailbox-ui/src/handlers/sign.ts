import { IQueue } from '@waves.exchange/provider-ui-components';
import { SignedTx, SignerTx } from '@waves/signer';
import { IState, IUser } from '../interface';
import sign from '../router/sign';
import { preload, toQueue, loadUserData } from './helpers';

export const getSignHandler = (
    queue: IQueue,
    state: IState
): ((list: Array<SignerTx>) => Promise<Array<SignedTx<SignerTx>>>) =>
    toQueue(queue, (list: Array<SignerTx>) => {
        preload();

        return loadUserData(state as IState<IUser>).then((state) =>
            sign(list, state)
        );
    });
