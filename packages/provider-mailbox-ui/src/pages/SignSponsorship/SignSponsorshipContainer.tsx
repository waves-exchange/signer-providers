import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import {
    SignSponsorshipComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { SponsorshipTransaction } from '@waves/ts-types';
import { PENDING_SIGN_TEXT } from '../../constants/constants';

const { WAVES } = CONSTANTS;
const { getPrintableNumber } = utils;

export const SignSponsorship: FC<ISignTxProps<SponsorshipTransaction>> = ({
    meta,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const sponsorAsset = tx.assetId === null ? WAVES : meta.assets[tx.assetId];
    const sponsorCharge = getPrintableNumber(
        tx.minSponsoredAssetFee || 0,
        sponsorAsset.decimals
    );
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    const [isPending, setIsPending] = React.useState<boolean>(false);

    const _onConfirm = React.useCallback(
        (e): void => {
            onConfirm(e);
            setIsPending(true);
        },
        [onConfirm]
    );

    return (
        <SignSponsorshipComponent
            key={tx.id}
            userAddress={user.address}
            userName={user.name}
            userBalance={user.balance}
            tx={tx}
            fee={`${fee} ${WAVES.ticker}`}
            sponsorAsset={sponsorAsset}
            sponsorCharge={`${sponsorCharge} ${sponsorAsset.name}`}
            isSponsorshipEnable={Number(tx.minSponsoredAssetFee) > 0}
            onReject={onCancel}
            onConfirm={_onConfirm}
            isPending={isPending}
            pendingText={PENDING_SIGN_TEXT}
        />
    );
};
