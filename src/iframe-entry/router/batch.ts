import { SignerTx } from '@waves/signer';
import { Transaction } from '@waves/ts-types';
import { makeTxBytes } from '@waves/waves-transactions';
import { ITransactionInfo, IUser } from '../../interface';
import { IState } from '../interface';
import batchPage from '../pages/batch';
import renderPage from '../utils/renderPage';

export default function (
    list: Array<ITransactionInfo<Transaction>>,
    state: IState<IUser>
): Promise<Array<SignerTx>> {
    return new Promise((resolve, reject) => {
        renderPage(
            batchPage({
                networkByte: state.networkByte,
                sender: state.user.address,
                user: state.user,
                list,
                onConfirm: async () => {
                    const signedTxList: SignerTx[] = [];

                    for await (const item of list) {
                        const txBytes = makeTxBytes(item.tx as any);
                        const signature = await state.identity.signBytes(
                            txBytes
                        );

                        signedTxList.push({
                            ...(item.tx as any),
                            proofs: [
                                ...((item.tx as any).proofs || []),
                                signature,
                            ],
                        });
                    }

                    resolve(signedTxList);
                },
                onCancel: () => {
                    reject(new Error('User rejection!'));
                },
            })
        );
    });
}
