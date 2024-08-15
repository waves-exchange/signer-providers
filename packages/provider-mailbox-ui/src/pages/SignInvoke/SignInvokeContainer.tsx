import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import {
    SignInvoke as SignInvokeComponent,
    CONSTANTS,
    hooks,
    utils,
} from '@waves.exchange/provider-ui-components';
import {
    InvokeScriptCall,
    InvokeScriptPayment,
    InvokeScriptTransaction,
    Long,
} from '@waves/ts-types';
import { PENDING_SIGN_TEXT } from '../../constants/constants';

const { WAVES } = CONSTANTS;
const { assetPropFactory, getPrintableNumber, isAlias } = utils;

export interface IPayment {
    assetId: string | null;
    name: string;
    amount: Long;
    logo?: string;
    decimals: number;
}

export const SignInvoke: FC<ISignTxProps<InvokeScriptTransaction>> = ({
    meta,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const getAssetProp = assetPropFactory(meta.assets);

    const feeAsset = meta.assets[tx.feeAssetId || ''] || WAVES;

    const fee = getPrintableNumber(tx.fee, feeAsset.decimals);

    const mapPayments = (
        payments: Array<InvokeScriptPayment>
    ): Array<IPayment> =>
        payments.map(({ assetId, amount }) => ({
            assetId,
            name: getAssetProp(assetId, 'name'),
            amount: getPrintableNumber(
                amount,
                getAssetProp(assetId, 'decimals')
            ),
            logo: getAssetProp(assetId, 'logo'),
            decimals: getAssetProp(assetId, 'decimals'),
        }));

    const dAppAddress = isAlias(tx.dApp) ? meta.aliases[tx.dApp] : tx.dApp;

    const [handleFeeSelect, txJSON] = hooks.useHandleFeeSelect(tx);

    const [isPending, setIsPending] = React.useState<boolean>(false);

    const _onConfirm = React.useCallback(
        (e): void => {
            onConfirm(e);
            setIsPending(true);
        },
        [onConfirm]
    );

    return (
        <SignInvokeComponent
            userAddress={user.address}
            userName={user.name}
            userBalance={user.balance}
            dAppAddress={dAppAddress}
            dAppName={tx.dApp}
            fee={`${fee} ${getAssetProp(tx.feeAssetId, 'name')}`}
            call={tx.call as InvokeScriptCall<Long>}
            chainId={tx.chainId}
            payment={mapPayments(tx.payment || [])}
            onCancel={onCancel}
            onConfirm={_onConfirm}
            tx={tx}
            txJSON={txJSON}
            meta={meta}
            handleFeeSelect={handleFeeSelect}
            isPending={isPending}
            pendingText={PENDING_SIGN_TEXT}
        />
    );
};
