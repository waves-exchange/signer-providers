import {
    fetchBalance,
    fetchScriptInfo,
} from '@waves/node-api-js/es/api-node/addresses';
import { fetchByAddress } from '@waves/node-api-js/es/api-node/alias';
import { Long } from '@waves/ts-types';

export function fetchAliasses(
    base: string,
    address: string
): Promise<Array<string>> {
    return fetchByAddress(base, address);
}

export function fetchWavesBalance(
    base: string,
    address: string
): Promise<Long> {
    return fetchBalance(base, address).then((info) => info.balance);
}

export function fetchAddressHasScript(
    base: string,
    address: string
): Promise<boolean> {
    return fetchScriptInfo(base, address)
        .then((info) => info.extraFee !== 0)
        .catch(() => false);
}
