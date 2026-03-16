import {
    DetailsWithLogo,
    utils,
    TOrderArgs,
} from '@waves.exchange/provider-ui-components';
import { loadLogoInfo } from '@waves.exchange/provider-ui-components/src/utils';
import { fetchDetails } from '@waves/node-api-js/es/api-node/assets';
import { IState, IUser } from '../interface';
import { CONSTANTS } from '@waves.exchange/provider-ui-components';

export const prepareOrder = (
    state: IState<IUser>,
    order: TOrderArgs
): Promise<TOrderArgs & { assetsHash: Record<string, DetailsWithLogo> }> => {
    const assetsIdList: string[] = utils.getIdsFromOrder(order);

    const loadAssets = fetchDetails(state.nodeUrl, assetsIdList);

    return loadAssets.then(loadLogoInfo(state.networkByte)).then((assets) => {
        assets.push((CONSTANTS.WAVES as unknown) as DetailsWithLogo);

        return {
            ...order,
            assetsHash: assets.reduce<Record<string, DetailsWithLogo>>(
                (acc, asset) => {
                    acc[asset.assetId] = asset;

                    return acc;
                },
                {}
            ),
        };
    });
};
