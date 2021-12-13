import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { getPrintableNumber } from './math';
import { Long } from '@waves/ts-types';
import { WAVES } from '../constants';

export function toFormat(
    num: Long,
    id: string | null,
    hash: Record<string, TAssetDetails>
): string {
    const asset = id != null ? hash[id] : WAVES;

    if (asset == null) {
        throw new Error('Asset not found!');
    }

    return `${getPrintableNumber(num, asset.decimals)} ${asset.name}`;
}
