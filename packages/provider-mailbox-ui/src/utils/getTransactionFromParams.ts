import { CONSTANTS, utils } from '@waves.exchange/provider-ui-components';
import { makeTx, libs } from '@waves/waves-transactions';
import { curry } from 'ramda';
import { SignerTx } from '@waves/signer';

const { NAME_MAP } = CONSTANTS;
const { fixRecipient } = utils;

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
    options: { networkByte: number; privateKey: string; timestamp: number },
    tx: SignerTx
) => SignerTx;

export const geTransactionFromParams = curry<GeTransactionFromParams>(
    ({ networkByte, privateKey, timestamp }, tx): SignerTx => {
        return makeTx({
            chainId: networkByte,
            senderPublicKey: libs.crypto.publicKey({ privateKey }),
            timestamp,
            ...fixParams(networkByte, tx),
        } as any) as any;
    }
);
