import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { Long } from '@waves/ts-types';
import { ENV } from '../../../provider-cloud-ui/src/services/configService';
import { curry } from 'ramda';
import { DetailsWithLogo } from '../interface';

export const loadLogoInfo = curry(
    (
        env: ENV,
        data: Array<TAssetDetails<Long>>
    ): Promise<Array<DetailsWithLogo>> =>
        Promise.all(
            data.map((asset) => {
                const network = env === ENV.mainnet ? '' : 'testnet.';
                const fetchLogoUrl = `https://${network}wx.network/static/icons/assets/${asset.assetId}.svg`;

                return fetch(fetchLogoUrl).then((response) => {
                    if (response.ok) {
                        return { ...asset, logo: fetchLogoUrl };
                    }

                    return asset;
                });
            })
        )
);
