import React, { FC, useCallback, useState, ChangeEventHandler } from 'react';
import { ISignTxProps } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import {
    SignIssueComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { IssueTransaction } from '@waves/ts-types';

const { WAVES } = CONSTANTS;
const { getPrintableNumber } = utils;

export const SignIssueContainer: FC<ISignTxProps<IssueTransaction>> = ({
    tx,
    user,
    onCancel,
    onConfirm,
}) => {
    const { userBalance } = useTxUser(user);

    const [canConfirm, setCanConfirm] = useState(false);
    const handleTermsCheck = useCallback<ChangeEventHandler<HTMLInputElement>>(
        ({ target: { checked } }) => {
            setCanConfirm(checked);
        },
        [setCanConfirm]
    );

    return (
        <SignIssueComponent
            assetId={tx.id}
            assetName={tx.name}
            assetDescription={tx.description}
            assetType={tx.reissuable ? 'Reissuable' : 'Non-reissuable'}
            decimals={tx.decimals}
            assetScript={tx.script || ''}
            userAddress={user.address}
            userName={user.name}
            userBalance={userBalance}
            issueAmount={`${tx.quantity} ${tx.name}`}
            onConfirm={onConfirm}
            onReject={onCancel}
            onTermsCheck={handleTermsCheck}
            canConfirm={canConfirm}
            tx={tx}
            fee={`${getPrintableNumber(tx.fee, WAVES.decimals)} WAVES`}
        />
    );
};
