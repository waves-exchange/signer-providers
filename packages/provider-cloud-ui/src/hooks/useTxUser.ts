import { IUserWithBalances } from '../interface';
import { WAVES } from '../constants';
import { getPrintableNumber } from '../utils/math';

export const useTxUser = (user: IUserWithBalances): { userBalance: string } => {
    const userBalance = getPrintableNumber(user.balance, WAVES.decimals);

    return { userBalance };
};
