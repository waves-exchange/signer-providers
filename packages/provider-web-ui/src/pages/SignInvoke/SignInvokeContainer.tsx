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
import { useTxUser } from '../../hooks/useTxUser';

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
    networkByte,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const { userName } = useTxUser(user, networkByte);
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

    return (
        <SignInvokeComponent
            userAddress={user.address}
            userName={userName}
            userBalance={user.balance}
            dAppAddress={dAppAddress}
            dAppName={tx.dApp}
            fee={`${fee} ${getAssetProp(tx.feeAssetId, 'name')}`}
            call={tx.call as InvokeScriptCall<Long>}
            chainId={tx.chainId}
            payment={mapPayments(tx.payment || [])}
            onCancel={onCancel}
            onConfirm={onConfirm}
            tx={tx}
            txJSON={txJSON}
            meta={meta}
            handleFeeSelect={handleFeeSelect}
        />
    );
};
