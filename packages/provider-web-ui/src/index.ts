import { Bus, WindowAdapter } from '@waves/waves-browser-bus';
import { getConnectHandler } from './handlers/connect';
import { getLoginHandler } from './handlers/login';
import { getSignHandler } from './handlers/sign';
import { getSignMessageHandler } from './handlers/signMessage';
import { IState, IUser } from './interface';
import {
    utils,
    TBusHandlers,
    IBusEvents,
} from '@waves.exchange/provider-ui-components';
import { getData } from './handlers/getData';

const { Queue } = utils;
const queue = new Queue(3);

const referrerURL = new URL(document.referrer);
const referrer = referrerURL.origin;
const referrerPathnameWithSearch =
    referrerURL.href?.replace(referrer, '') || '';
const referrerPathname = referrerPathnameWithSearch.length
    ? referrerPathnameWithSearch
    : '';

const { analytics } = utils;

analytics.init({
    userType: 'unknown',
    providerType: 'provider-web',
    referrer,
    referrerPathname,
});

const isThisIsLoginWindow = window.top === window && window.opener;
const isThisIsIframe = window.top !== window;
const isTransferIFrame = window.location.search.includes('transferWindow=true');

// if (isThisIsLoginWindow) {
//     const intervalId = setInterval(() => {
//         if ('__loaded' in window.opener) {
//             window.opener.__loginWindow = window;
//             clearInterval(intervalId);
//         }
//     }, 100);
// }

// if (isThisIsIframe) {
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
            matcherUrl: undefined,
        };

        // Object.defineProperty(window, '__setUser', {
        //     writable: false,
        //     value: (user: IUser) => {
        //         state.user = user;
        //     },
        // });

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

        if (isThisIsLoginWindow) {
            // const intervalId = setInterval(() => {
            //     if ('__loginWindow' in window.opener) {
            bus.dispatchEvent('ready', void 0);
            // clearInterval(intervalId);
            //     }
            // }, 100);
        } else {
            bus.dispatchEvent('ready', void 0);
        }

        // if (!isTransferIFrame) {
            console.log('%c WINDOW', 'color: #e5b6ed', getData());
            bus.dispatchEvent('transferStorage', getData());
        // }

        if (isTransferIFrame) {
            console.log('%c IFRAME', 'color: #e5b6ed');
            bus.once('catchStorage', (data) => {
                console.log('DATA', data);
                console.log('%c localStorage', 'color: #e5b6ed', localStorage);
                Object.keys(data).forEach((key) => {
                    localStorage.setItem(key, data[key]);
                });
            });
        }

        window.addEventListener('unload', () => {
            bus.dispatchEvent('close', undefined);
        });
    })
    .catch(console.error);
