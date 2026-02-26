import { BigNumber } from '@waves/bignumber';

type TPriceMode =
    | 'assetDecimals'
    | 'fixedDecimals'
    | 'ASSET_DECIMALS'
    | 'FIXED_DECIMALS'
    | undefined
    | null;

const getViewPriceMode = (
    version: number,
    priceMode: TPriceMode
): 'assetDecimals' | 'fixedDecimals' => {
    if (version <= 3) {
        return 'assetDecimals';
    }

    return priceMode === 'assetDecimals' || priceMode === 'ASSET_DECIMALS'
        ? 'assetDecimals'
        : 'fixedDecimals'; // v4 + no priceMode => fixedDecimals
};

export const normalizeOrderPriceForView = ({
    rawPrice,
    version,
    priceMode,
    amountAssetDecimals,
    priceAssetDecimals,
}: {
    rawPrice: string | number;
    version: number;
    priceMode: TPriceMode;
    amountAssetDecimals: number;
    priceAssetDecimals: number;
}): BigNumber => {
    const mode = getViewPriceMode(version, priceMode);
    const scale =
        mode === 'fixedDecimals'
            ? 8
            : 8 + priceAssetDecimals - amountAssetDecimals;

    return new BigNumber(rawPrice).div(new BigNumber(10).pow(scale));
};
