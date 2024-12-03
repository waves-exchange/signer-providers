import { Text, Flex, Box } from '@waves.exchange/react-uikit';
import { Long, Transaction } from '@waves/ts-types';
import React from 'react';
import { ITransactionInfo } from '../../interface';
import { Confirmation, DataJson } from '../../components';
import { WAVES } from '../../constants';
import { getPrintableNumber } from '../../utils';

export interface IProps {
    sender: string;
    networkByte: number;
    user: {
        address: string;
        publicKey: string;
        balance: Long;
        name?: string;
    };
    list: Array<ITransactionInfo<Transaction>>;
    onConfirm: (e?: any) => void;
    onCancel: () => void;
    pendingText?: string;
    isPending?: boolean;
}

const BatchRender: React.FC<IProps> = ({
    user,
    list,
    onConfirm,
    onCancel,
    pendingText,
    isPending,
}) => {
    const [isShowAll, setIsShowAll] = React.useState<boolean>(false);
    const isTxHidden = React.useMemo((): boolean => {
        return list.length > 3;
    }, [list.length]);

    return (
        <Confirmation
            address={user.address}
            name={user.name || ''}
            balance={`${getPrintableNumber(
                user.balance,
                WAVES.decimals
            )} Waves`}
            onReject={onCancel}
            onConfirm={onConfirm}
            isPending={isPending}
            pendingText={pendingText}
        >
            <Flex flexDirection="column" px="$40" py="$20" bg="main.$900">
                <Flex flexDirection="column" justifyContent="center">
                    <Text fontSize={26} lineHeight="32px" color="standard.$0">
                        Sign Batch
                    </Text>
                    <Text variant="body2" color="basic.$500" mr="$5">
                        Transactions Count: {list.length}
                    </Text>
                </Flex>
                <Flex flexDirection="column" justifyContent="center">
                    {(isShowAll ? list : list.slice(0, 3)).map(({ tx }) => {
                        return (
                            <Box key={tx.id} mb={12}>
                                <DataJson data={tx} />
                            </Box>
                        );
                    })}
                </Flex>
                {isTxHidden && !isShowAll ? (
                    <Flex justifyContent="flex-end">
                        <Text
                            variant="body2"
                            color="primary.$500"
                            mr="$5"
                            cursor="pointer"
                            onClick={() => setIsShowAll(true)}
                        >
                            Show All
                        </Text>
                    </Flex>
                ) : null}
            </Flex>
        </Confirmation>
    );
};

export function batchPage(props: IProps): React.ReactElement {
    return <BatchRender {...props} />;
}
