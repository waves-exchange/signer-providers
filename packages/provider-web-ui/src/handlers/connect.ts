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
            apiToken:
                state.networkByte === 87
                    ? 'e3b3df0d53b4cae5b75350d898132934'
                    : 'ca96b9de2a3dd00b62ec70f7ef6ffb3e',
            libraryUrl: 'https://wx.network/amplitude.js',
            initializeMethod: 'amplitudeInit',
            sendMethod: 'amplitudePushEvent',
            type: 'logic',
        });

        utils.analytics.addApi({
            libraryUrl: 'https://wx.network/snowPlow.js',
            initializeMethod: 'spInit',
            sendMethod: 'spPushEvent',
            type: 'sp',
            appId: 'signer',
        });

        utils.analytics.activate();
    };
}
