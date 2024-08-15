import React, { FC, useCallback, useState, ChangeEventHandler } from 'react';
import { ISignTxProps } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import {
    SignIssueComponent,
    CONSTANTS,
    utils,
} from '@waves.exchange/provider-ui-components';
import { IssueTransaction } from '@waves/ts-types';
import { PENDING_SIGN_TEXT } from '../../constants/constants';

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

    const [isPending, setIsPending] = React.useState<boolean>(false);

    const _onConfirm = React.useCallback(
        (e): void => {
            onConfirm(e);
            setIsPending(true);
        },
        [onConfirm]
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
            onConfirm={_onConfirm}
            onReject={onCancel}
            onTermsCheck={handleTermsCheck}
            canConfirm={canConfirm}
            tx={tx}
            fee={`${getPrintableNumber(tx.fee, WAVES.decimals)} WAVES`}
            isPending={isPending}
            pendingText={PENDING_SIGN_TEXT}
        />
    );
};
