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

const { analytics, Queue, isSafari, isBrave } = utils;

const queue = new Queue(3);

const referrerURL = new URL(document.referrer);
const referrer = referrerURL.origin;
const referrerPathname = referrerURL.pathname?.replace('/', '').length
    ? referrerURL.pathname
    : undefined;

analytics.init({
    platform: 'web',
    userType: 'provider-cloud',
    referrer,
    referrerPathname,
});

const isLoginWindowInSafari =
    window.top === window && window.opener && (isSafari() || isBrave());
// const isIframeSafari = window.top !== window && (isSafari() || isBrave());
//
// if (isLoginWindowInSafari) {
//     const intervalId = setInterval(() => {
//         if ('__loaded' in window.opener) {
//             window.opener.__loginWindow = window;
//             clearInterval(intervalId);
//         }
//     }, 100);
// }
//
// if (isIframeSafari) {
//     window.addEventListener('load', () => {
//         window['__loaded'] = true;
//     });
// }

WindowAdapter.createSimpleWindowAdapter()
    .then((adapter) => {
        const bus = new Bus<IBusEvents, TBusHandlers>(adapter);

        const state: IState = {
            user: null,
            networkByte: 87,
            nodeUrl: 'https://nodes.wavesplatform.com',
            identity: new IdentityService(),
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

        // if (isLoginWindowInSafari) {
        //     const intervalId = setInterval(() => {
        //         if ('__loginWindow' in window.opener) {
        //             bus.dispatchEvent('ready', void 0);
        //             clearInterval(intervalId);
        //
        //             console.warn(
        //                 'isLoginWindowInSafari',
        //                 window.opener['__loginWindow'],
        //                 window.opener['__loginWindow'] === window
        //             );
        //             const geetestAdapter = new WindowAdapter(
        //                 [
        //                     new WindowProtocol(
        //                         window.opener,
        //                         WindowProtocol.PROTOCOL_TYPES.LISTEN
        //                     ),
        //                 ],
        //                 [
        //                     new WindowProtocol(
        //                         window,
        //                         WindowProtocol.PROTOCOL_TYPES.DISPATCH
        //                     ),
        //                 ]
        //             );
        //             const geetestBus = new Bus(geetestAdapter);
        //
        //             geetestBus.registerRequestHandler(
        //                 'fetchData',
        //                 (url: string) => {
        //                     console.warn('registerRequestHandler', url);
        //
        //                     return fetchGeeTestToken(url);
        //                 }
        //             );
        //         }
        //     }, 100);
        // } else {
        //     bus.dispatchEvent('ready', void 0);
        // }

        bus.dispatchEvent('ready', void 0);

        if (isLoginWindowInSafari) {
            console.warn('isLoginWindowInSafari');
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

            geetestBus.registerRequestHandler('fetchData', (url: string) => {
                console.warn('registerRequestHandler', url);

                return fetchGeeTestToken(url);
            });
        }

        window.addEventListener('unload', () => {
            bus.dispatchEvent('close', undefined);
        });
    })
    .catch(console.error);
