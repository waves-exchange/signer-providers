import {
    IOrder,
    IOrderCreationParams,
    isOrderCreationParams,
    TOrderArgs,
} from '../interface';

const isString = (id: string | null | undefined): id is string =>
    typeof id === 'string';

export const getIdsFromOrder = (order: TOrderArgs): string[] => {
    let assetsIdList: string[] = [];
    const isOrderCreation = isOrderCreationParams(order);

    if (isOrderCreation) {
        const orderCreationParams = order as IOrderCreationParams;

        assetsIdList = [
            orderCreationParams.amountAsset,
            orderCreationParams.priceAsset,
            orderCreationParams.matcherFeeAssetId,
        ].filter(isString);
    } else {
        const orderWithAssetPair = order as IOrder;

        assetsIdList = [
            orderWithAssetPair.assetPair.amountAsset,
            orderWithAssetPair.assetPair.priceAsset,
        ].filter(isString);
    }

    return assetsIdList;
};
