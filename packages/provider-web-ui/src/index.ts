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

const { Queue } = utils;
const queue = new Queue(3);

const referrerURL = new URL(document.referrer);
const referrer = referrerURL.origin;
const referrerPathnameWithSearch =
    referrerURL.href?.replace(referrer, '') || '';
const referrerPathname = referrerPathnameWithSearch.length
    ? referrerPathnameWithSearch
    : '';

const { analytics, isSafari, isBrave } = utils;

analytics.init({
    userType: 'unknown',
    providerType: 'provider-web',
    referrer,
    referrerPathname,
});

const isLoginWindowInSafari =
    window.top === window && window.opener && (isSafari() || isBrave());
const isIframeSafari = window.top !== window && (isSafari() || isBrave());

if (isLoginWindowInSafari) {
    const intervalId = setInterval(() => {
        if ('__loaded' in window.opener) {
            window.opener.__loginWindow = window;
            clearInterval(intervalId);
        }
    }, 100);
}

if (isIframeSafari) {
    window.addEventListener('load', () => {
        window['__loaded'] = true;
    });
}

WindowAdapter.createSimpleWindowAdapter()
    .then((adapter) => {
        const bus = new Bus<IBusEvents, TBusHandlers>(adapter);

        const state: IState = {
            user: null,
            networkByte: 87,
            nodeUrl: 'https://nodes.wavesplatform.com',
            matcherUrl: undefined,
        };

        Object.defineProperty(window, '__setUser', {
            writable: false,
            value: (user: IUser) => {
                state.user = user;
            },
        });

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

        if (isLoginWindowInSafari) {
            const intervalId = setInterval(() => {
                if ('__loginWindow' in window.opener) {
                    bus.dispatchEvent('ready', void 0);
                    clearInterval(intervalId);
                }
            }, 100);
        } else {
            bus.dispatchEvent('ready', void 0);
        }

        window.addEventListener('unload', () => {
            bus.dispatchEvent('close', undefined);
        });
    })
    .catch(console.error);
