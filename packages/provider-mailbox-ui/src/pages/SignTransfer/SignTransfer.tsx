import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import {
    SignTransfer as SignTransferComponent,
    iconTransferUtils,
    hooks,
    transferUtils,
    TransferType,
} from '@waves.exchange/provider-ui-components';
import { PENDING_SIGN_TEXT } from '../../constants/constants';

const { getViewData, isTransferMeta } = transferUtils;
const { getIconType } = iconTransferUtils;

export const SignTransfer: FC<ISignTxProps<TransferType>> = ({
    meta: txMeta,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const [handleFeeSelect, txJSON] = hooks.useHandleFeeSelect(tx);
    const [isPending, setIsPending] = React.useState<boolean>(false);

    const { totalTransferAmount, transferList, fee, attachment } = getViewData(
        tx,
        txMeta
    );

    const isMassTransfer = tx.type === 11;

    const _onConfirm = React.useCallback(
        (e): void => {
            onConfirm(e);
            setIsPending(true);
        },
        [onConfirm]
    );

    return (
        <SignTransferComponent
            userAddress={user.address}
            userName={user.name}
            userBalance={user.balance}
            transferList={transferList}
            transferFee={fee}
            attachment={attachment}
            tx={tx}
            meta={isTransferMeta(txMeta) ? txMeta : undefined}
            onReject={onCancel}
            onConfirm={_onConfirm}
            handleFeeSelect={handleFeeSelect}
            txJSON={txJSON}
            iconType={getIconType(tx, user, Object.keys(txMeta.aliases))}
            transferAmount={`-${totalTransferAmount}`}
            isMassTransfer={isMassTransfer}
            isPending={isPending}
            pendingText={PENDING_SIGN_TEXT}
        />
    );
};
