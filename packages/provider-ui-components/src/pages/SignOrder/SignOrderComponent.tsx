import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation/Confirmation';
import {
    Box,
    Flex,
    Text,
    BoxProps,
    AssetLogoWithIcon,
    Copy,
    iconSmartMini,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
} from '@waves.exchange/react-uikit';
import imgUrl from '../../img/transaction-icons-30_1.svg';
import { DataJson } from '../../components';
import {
    DetailsWithLogo,
    IOrder,
    IOrderCreationParams,
    isOrderCreationParams,
    TOrderArgs,
} from '../../interface';
import { WAVES } from '../../constants';
import { getPrintableNumber } from '../../utils';
import { normalizeOrderPriceForView } from './normalizePriceForView';

export const commonStyles = (): BoxProps => {
    return {
        position: 'relative',
        width: 40,
        height: 40,
        minWidth: 40,
        overflow: 'hidden',
        sx: {
            '&::before': {
                content: '""',
                position: 'absolute',
                width: 80,
                height: 80,
                overflow: 'hidden',
                backgroundPositionY: 0,
                backgroundImage: `url(${imgUrl})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'auto 80px',
                display: 'block',
                backgroundPositionX: -80,
            },
        },
    };
};

const AssetData: FC<{ asset: DetailsWithLogo }> = ({ asset }) => (
    <Box>
        <Text variant="body2" color="basic.$500">
            Price Asset ID
        </Text>
        <Flex alignItems="center" mt="$5">
            <AssetLogoWithIcon
                assetId={asset.assetId}
                name={asset.name}
                size="30px"
                flexShrink={0}
                icon={iconSmartMini}
                iconVisible={asset.scripted}
                iconLabel="Smart asset"
                popperOptions={{}}
            />
            <Copy
                ml="$10"
                inititialTooltipLabel={'Copy Asset ID'}
                copiedTooltipLabel={'Copied!'}
                text={asset.assetId}
            >
                <Text variant="body2" color="standard.$0" isTruncated={true}>
                    {asset.assetId}
                </Text>
            </Copy>
        </Flex>
    </Box>
);

type SignOrderComponentProps = {
    userAddress: string;
    userName: string;
    userBalance: string;
    order: TOrderArgs;
    assetsHash: Record<string, DetailsWithLogo>;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
    isPending?: boolean;
    pendingText?: string;
};

export const SignOrderComponent: FC<SignOrderComponentProps> = ({
    userAddress,
    userName,
    userBalance,
    order,
    assetsHash,
    onReject,
    onConfirm,
    isPending,
    pendingText,
}) => {
    const isOrderCreation = isOrderCreationParams(order);
    const assetPairs = isOrderCreation
        ? {
              amountAsset: (order as IOrderCreationParams).amountAsset,
              priceAsset: (order as IOrderCreationParams).priceAsset,
          }
        : (order as IOrder).assetPair;

    const amountAssetId = assetPairs.amountAsset || WAVES.assetId;
    const amountAsset = assetsHash[amountAssetId];
    const amountRow = amountAsset
        ? `${order.orderType} ${getPrintableNumber(
              order.amount,
              amountAsset.decimals
          )} ${amountAsset.name}`
        : null;

    const priceAssetId = assetPairs.priceAsset || WAVES.assetId;
    const priceAsset = assetsHash[priceAssetId];
    const orderVersion =
        'version' in order && typeof order.version === 'number'
            ? order.version
            : 4;
    const orderPriceMode = 'priceMode' in order ? order.priceMode : undefined;
    const viewPrice = normalizeOrderPriceForView({
        rawPrice: order.price,
        version: orderVersion,
        priceMode: orderPriceMode,
        amountAssetDecimals: amountAsset?.decimals ?? 8,
        priceAssetDecimals: priceAsset?.decimals ?? 8,
    });
    const priceRow = priceAsset
        ? `${viewPrice.roundTo(priceAsset?.decimals ?? 8).toFixed()} ${
              priceAsset.name
          }`
        : null;

    const matcherFeeAssetId = isOrderCreation
        ? (order as IOrderCreationParams).matcherFeeAssetId || WAVES.assetId
        : WAVES.assetId;
    const matcherFeeRow = order.matcherFee
        ? `${getPrintableNumber(
              order.matcherFee || 0,
              assetsHash[matcherFeeAssetId].decimals
          )} ${assetsHash[matcherFeeAssetId].name}`
        : null;

    return (
        <Confirmation
            address={userAddress}
            name={userName}
            balance={userBalance}
            onReject={onReject}
            onConfirm={onConfirm}
            isPending={isPending}
            pendingText={pendingText}
        >
            <Flex px="$40" py="$20" bg="main.$900">
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="circle"
                    bg="rgb(180, 85, 255, 0.1)"
                    height={60}
                    width={60}
                >
                    <Box {...(commonStyles() as any)} />
                </Flex>
                <Flex
                    ml="$20"
                    flexDirection="column"
                    sx={{ textTransform: 'capitalize' }}
                >
                    <Text variant="body1" color="basic.$500">
                        Sign {order.orderType} Order
                    </Text>
                    <Text fontSize={26} lineHeight="32px" color="standard.$0">
                        {amountRow}
                    </Text>
                </Flex>
            </Flex>

            <Tabs>
                <TabsList
                    borderBottom="1px solid"
                    borderColor="main.$700"
                    bg="main.$900"
                    mb="$30"
                    px="$40"
                >
                    <Tab mr="32px" pb="12px">
                        <Text variant="body1">Main</Text>
                    </Tab>
                    <Tab mr="32px" pb="12px">
                        <Text variant="body1">JSON</Text>
                    </Tab>
                </TabsList>

                <TabPanels bg="main.$800" mb="$30" px="$40">
                    <TabPanel>
                        <Flex
                            flexDirection="column"
                            bg="main.$800"
                            sx={{ gap: '24px' }}
                        >
                            {priceRow ? (
                                <Box>
                                    <Text variant="body2" color="basic.$500">
                                        Price
                                    </Text>
                                    <Text
                                        variant="body2"
                                        color="standard.$0"
                                        display="block"
                                        mt="5px"
                                    >
                                        {priceRow}
                                    </Text>
                                </Box>
                            ) : null}
                            {assetPairs.priceAsset ? (
                                <AssetData
                                    asset={assetsHash[assetPairs.priceAsset]}
                                />
                            ) : null}
                            {order.matcherFee ? (
                                <Box>
                                    <Text variant="body2" color="basic.$500">
                                        Matcher fee
                                    </Text>
                                    <Text
                                        variant="body2"
                                        color="standard.$0"
                                        display="block"
                                        mt="5px"
                                    >
                                        {matcherFeeRow}
                                    </Text>
                                </Box>
                            ) : null}
                        </Flex>
                    </TabPanel>
                    <TabPanel>
                        <DataJson data={order} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Confirmation>
    );
};
