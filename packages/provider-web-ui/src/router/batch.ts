import { SignerTx } from '@waves/signer';
import { Transaction } from '@waves/ts-types';
import { libs, signTx } from '@waves/waves-transactions';
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
                user: {
                    address: state.user.address,
                    publicKey: libs.crypto.publicKey({
                        privateKey: state.user.privateKey,
                    }),
                    balance: state.user.balance,
                },
                list,
                onConfirm: () => {
                    resolve(
                        list.map((item) =>
                            signTx(item.tx as any, {
                                privateKey: state.user.privateKey,
                            })
                        ) as any
                    ); // TODO Fix types
                },
                onCancel: () => {
                    reject(new Error('User rejection!'));
                },
            })
        );
    });
}
