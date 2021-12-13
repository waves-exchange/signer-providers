import { curry } from 'ramda';
import { isAddress } from './isAddress';
import { cleanAddress } from './cleanAlias';

export const fixRecipient = curry(
    <T extends { recipient: string }>(networkByte: number, data: T): T => {
        const address = cleanAddress(data.recipient);

        if (isAddress(address)) {
            return { ...data, recipient: address };
        } else {
            return {
                ...data,
                recipient: `alias:${String.fromCharCode(
                    networkByte
                )}:${address}`,
            };
        }
    }
);
