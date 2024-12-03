import { SignerTx } from '@waves/signer';
import { Transaction } from '@waves/ts-types';
import { makeTxBytes } from '@waves/waves-transactions';
import { IUserWithBalances } from '../interface';
import { IState } from '../interface';
import {
    batchPage,
    ITransactionInfo,
} from '@waves.exchange/provider-ui-components';
import renderPage from '../utils/renderPage';

export default function (
    list: Array<ITransactionInfo<Transaction>>,
    state: IState<IUserWithBalances>
): Promise<Array<SignerTx>> {
    return new Promise((resolve, reject) => {
        renderPage(
            batchPage({
                networkByte: state.networkByte,
                sender: state.user.address,
                user: state.user,
                list,
                onConfirm: async () => {
                    try {
                        const signedTxList: SignerTx[] = await Promise.all(
                            list.map(async (item) => {
                                const txBytes = makeTxBytes(item.tx as any);
                                const signature = await state.identity.signBytes(
                                    txBytes
                                );

                                return {
                                    ...(item.tx as any),
                                    proofs: [
                                        ...((item.tx as any).proofs || []),
                                        signature,
                                    ],
                                };
                            })
                        );

                        resolve(signedTxList);
                    } catch (e) {
                        reject(e);
                    }
                },
                onCancel: () => {
                    reject(new Error('User rejection!'));
                },
            })
        );
    });
}
