import { IUserWithBalances } from '../interface';
import { getUserName } from '../services/userService';
import { CONSTANTS, utils } from '@waves.exchange/provider-ui-components';

const { WAVES } = CONSTANTS;
const { getPrintableNumber } = utils;

export const useTxUser = (
    user: Omit<IUserWithBalances, 'seed'> & { publicKey: string },
    networkByte: number
): { userName: string; userBalance: string } => {
    const userName = getUserName(networkByte, user.publicKey);
    const userBalance = getPrintableNumber(user.balance, WAVES.decimals);

    return { userName, userBalance };
};
