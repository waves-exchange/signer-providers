import { fixRecipient } from './fixRecipient';
import { NAME_MAP } from '../constants';
import { makeTx } from '@waves/waves-transactions';
import { curry } from 'ramda';
import { SignerTx } from '@waves/signer';

const fixParams = (networkByte: number, tx: SignerTx): SignerTx => {
    const updateRecipient: <T extends { recipient: string }>(
        data: T
    ) => T = fixRecipient(networkByte);

    switch (tx.type) {
        case NAME_MAP.transfer:
            return updateRecipient(tx);
        case NAME_MAP.massTransfer:
            return { ...tx, transfers: tx.transfers.map(updateRecipient) };
        case NAME_MAP.lease:
            return updateRecipient(tx);
        default:
            return tx;
    }
};

type GeTransactionFromParams = (
    options: { networkByte: number; publicKey: string; timestamp: number },
    tx: SignerTx
) => SignerTx;

export const geTransactionFromParams = curry<GeTransactionFromParams>(
    ({ networkByte, publicKey, timestamp }, tx): SignerTx => {
        return makeTx({
            chainId: networkByte,
            senderPublicKey: publicKey,
            timestamp,
            ...fixParams(networkByte, tx),
        } as any) as any;
    }
);
