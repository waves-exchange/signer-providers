import { Bus, WindowAdapter, WindowProtocol } from '@waves/waves-browser-bus';
import { getConnectHandler } from './handlers/connect';
import { getLoginHandler } from './handlers/login';
import { getSignHandler } from './handlers/sign';
import { getSignMessageHandler } from './handlers/signMessage';
import { IState } from './interface';
import {
    IBusEvents,
    TBusHandlers,
    utils,
} from '@waves.exchange/provider-ui-components';
import { IdentityService } from '@waves.exchange/provider-cloud-auth';
import { fetchGeeTestToken } from '@waves.exchange/provider-cloud-auth'; // todo dep
import { ENV } from './services/configService';

const { analytics, Queue } = utils;

const queue = new Queue(3);

const referrerURL = new URL(document.referrer);
const referrer = referrerURL.origin;
const referrerPathnameWithSearch =
    referrerURL.href?.replace(referrer, '') || '';
const referrerPathname = referrerPathnameWithSearch.length
    ? referrerPathnameWithSearch
    : undefined;

analytics.init({
    userType: 'provider-cloud',
    providerType: 'provider-cloud',
    referrer,
    referrerPathname,
});

const isLoginWindowInSafari = window.top === window && window.opener;

WindowAdapter.createSimpleWindowAdapter()
    .then((adapter) => {
        const bus = new Bus<IBusEvents, TBusHandlers>(adapter);
        const _URL = new URL(location.href);
        const env = _URL.searchParams.get('env')?.replace(/\?.*/, '') as ENV;
        const state: IState = {
            user: null,
            networkByte: 87,
            nodeUrl: 'https://nodes.wavesnodes.com',
            identity: new IdentityService(),
            env,
        };

        bus.on('connect', getConnectHandler(state));

        bus.registerRequestHandler('login', getLoginHandler(queue, state));

        bus.registerRequestHandler(
            'sign-message',
            getSignMessageHandler(queue, state)
        );

        bus.registerRequestHandler('sign', getSignHandler(queue, state) as any);

        // TODO add matcher sign
        // TODO add remove order sign
        // TODO add create order sign

        bus.dispatchEvent('ready', void 0);

        if (isLoginWindowInSafari) {
            try {
                const geetestAdapter = new WindowAdapter(
                    [
                        new WindowProtocol(
                            window.opener,
                            WindowProtocol.PROTOCOL_TYPES.LISTEN
                        ),
                    ],
                    [
                        new WindowProtocol(
                            window,
                            WindowProtocol.PROTOCOL_TYPES.DISPATCH
                        ),
                    ]
                );

                const geetestBus = new Bus(geetestAdapter);

                geetestBus.registerRequestHandler(
                    'fetchData',
                    (url: string) => {
                        return fetchGeeTestToken(url);
                    }
                );
            } catch (e) {
                const errorBlock = document.createElement('div');

                errorBlock.innerText = 'Something went wrong. ' + e;
                document.body.appendChild(errorBlock);
            }
        }

        window.addEventListener('unload', () => {
            bus.dispatchEvent('close', undefined);
        });
    })
    .catch(console.error);
