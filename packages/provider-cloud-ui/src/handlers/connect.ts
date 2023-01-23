import { ConnectOptions } from '@waves/signer';
import { IState } from '../interface';
import { utils } from '@waves.exchange/provider-ui-components';

export function getConnectHandler(
    state: IState
): (options: ConnectOptions) => void {
    return (options): void => {
        state.nodeUrl = options.NODE_URL;
        state.networkByte = options.NETWORK_BYTE;

        utils.analytics.addApi({
            libraryUrl: 'https://waves.exchange/snowPlow.js',
            initializeMethod: 'spInit',
            sendMethod: 'spPushEvent',
            type: 'sp',
            appId: 'signer',
        });

        utils.analytics.activate();
    };
}
