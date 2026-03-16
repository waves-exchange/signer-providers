import { isOrderCreationParams, TOrderArgs } from '../interface';

export const getIdsFromOrder = (order: TOrderArgs): string[] => {
    let assetsIdList: string[] = [];
    const isOrderCreation = isOrderCreationParams(order);

    if (isOrderCreation) {
        assetsIdList = [
            order.amountAsset,
            order.priceAsset,
            order.matcherFeeAssetId,
        ].filter((id) => typeof id === 'string');
    } else {
        assetsIdList = [
            order.assetPair.amountAsset,
            order.assetPair.priceAsset,
        ].filter((id) => typeof id === 'string');
    }

    return assetsIdList;
};
