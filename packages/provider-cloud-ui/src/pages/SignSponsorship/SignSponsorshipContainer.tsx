import { SponsorshipTransaction } from '@waves/ts-types';
import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import {
    SignSponsorshipComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';

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
        tx.minSponsoredAssetFee,
        sponsorAsset.decimals
    );
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    return (
        <SignSponsorshipComponent
            key={tx.id}
            userAddress={user.address}
            userName={user.username}
            userBalance={user.balance}
            tx={tx}
            fee={`${fee} ${WAVES.ticker}`}
            sponsorAsset={sponsorAsset}
            sponsorCharge={`${sponsorCharge} ${sponsorAsset.name}`}
            isSponsorshipEnable={Number(tx.minSponsoredAssetFee) > 0}
            onReject={onCancel}
            onConfirm={onConfirm}
        />
    );
};
