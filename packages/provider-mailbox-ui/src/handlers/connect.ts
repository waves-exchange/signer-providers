import { ConnectOptions } from '@waves/signer';
import { IState } from '../interface';

export function getConnectHandler(
    state: IState
): (options: ConnectOptions) => void {
    return (options): void => {
        state.nodeUrl = options.NODE_URL;
        state.networkByte = options.NETWORK_BYTE;
        state.mailboxListener.setNetwork(options.NETWORK_BYTE);
    };
}
