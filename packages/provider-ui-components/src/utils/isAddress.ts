import { cleanAddress } from './cleanAlias';
import { MAX_ALIAS_LENGTH } from '../constants';

export function isAddress(address: string): boolean {
    return cleanAddress(address).length > MAX_ALIAS_LENGTH;
}
