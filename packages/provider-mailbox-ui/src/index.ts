import { Bus, WindowAdapter } from '@waves/waves-browser-bus';
import { getConnectHandler } from './handlers/connect';
import { getLoginHandler } from './handlers/login';
import { IState } from './interface';
import {
    IBusEvents,
    TBusHandlers,
    utils,
} from '@waves.exchange/provider-ui-components';
import { MailboxWXNListener } from './services';

const { Queue } = utils;
const queue = new Queue(3);

WindowAdapter.createSimpleWindowAdapter()
    .then((adapter) => {
        const bus = new Bus<IBusEvents, TBusHandlers>(adapter);
        const mailboxListener = new MailboxWXNListener();

        const state: IState = {
            user: null,
            networkByte: 87,
            nodeUrl: 'https://nodes.wavesnodes.com',
            mailboxListener,
        };

        bus.on('connect', getConnectHandler(state));

        bus.registerRequestHandler('login', getLoginHandler(queue, state));

        // bus.registerRequestHandler(
        //     'sign-message',
        //     getSignMessageHandler(queue, state)
        // );

        // bus.registerRequestHandler('sign', getSignHandler(queue, state) as any);

        bus.dispatchEvent('ready', void 0);

        window.addEventListener('unload', () => {
            bus.dispatchEvent('close', undefined);
        });
    })
    .catch(console.error);
