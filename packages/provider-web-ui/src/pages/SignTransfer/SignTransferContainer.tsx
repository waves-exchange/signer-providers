import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import {
    SignTransfer as SignTransferComponent,
    iconTransferUtils,
    hooks,
    transferUtils,
    TransferType,
} from '@waves.exchange/provider-ui-components';
import { useTxUser } from '../../hooks/useTxUser';

const { getViewData, isTransferMeta } = transferUtils;
const { getIconType } = iconTransferUtils;

export const SignTransfer: FC<ISignTxProps<TransferType>> = ({
    meta: txMeta,
    networkByte,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const [handleFeeSelect, txJSON] = hooks.useHandleFeeSelect(tx);
    const { userName } = useTxUser(user, networkByte);

    const { totalTransferAmount, transferList, fee, attachment } = getViewData(
        tx,
        txMeta
    );

    const isMassTransfer = tx.type === 11;

    return (
        <SignTransferComponent
            userAddress={user.address}
            userName={userName}
            userBalance={user.balance}
            transferList={transferList}
            transferFee={fee}
            attachment={attachment}
            tx={tx}
            meta={isTransferMeta(txMeta) ? txMeta : undefined}
            onReject={onCancel}
            onConfirm={onConfirm}
            handleFeeSelect={handleFeeSelect}
            txJSON={txJSON}
            iconType={getIconType(tx, user, Object.keys(txMeta.aliases))}
            transferAmount={`-${totalTransferAmount}`}
            isMassTransfer={isMassTransfer}
        />
    );
};
