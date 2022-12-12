import { catchable, TCatchable } from '../utils/catchable';
import { TPrivateMultiaccountData } from '../interface';
import { decryptMultiAccountData } from '../utils/decryptMultiAccountData';

export const getPrivateData = (
    password: string,
    multiAccountData: string | null,
    multiAccountHash: string | null,
    rounds?: number
): TCatchable<TPrivateMultiaccountData> => {
    const encrypted = JSON.parse(multiAccountData || 'null');
    const hash = JSON.parse(multiAccountHash || 'null');

    if (!hash || !encrypted) {
        return {
            ok: true,
            resolveData: {},
            rejectData: null,
        };
    }

    return catchable(decryptMultiAccountData)(
        encrypted,
        hash,
        password,
        rounds
    );
};
