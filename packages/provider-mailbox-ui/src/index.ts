import { Bus, WindowAdapter } from '@waves/waves-browser-bus';
import { getConnectHandler } from './handlers/connect';
import { getLoginHandler } from './handlers/login';
import { getSignHandler } from './handlers/sign';
import { IState } from './interface';
import {
    IBusEvents,
    TBusHandlers,
    utils,
} from '@waves.exchange/provider-ui-components';
import { MailboxWXNListener } from './services';
import { getSignMessageHandler } from './handlers/signMessage';

const { Queue } = utils;
const queue = new Queue(3);
const mailboxListener = new MailboxWXNListener();

WindowAdapter.createSimpleWindowAdapter()
    .then((adapter) => {
        const bus = new Bus<IBusEvents, TBusHandlers>(adapter);

        const state: IState = {
            user: null,
            networkByte: 87,
            nodeUrl: 'https://nodes.wavesnodes.com',
            mailboxListener,
        };

        bus.on('connect', getConnectHandler(state));

        bus.registerRequestHandler('login', getLoginHandler(queue, state));

        bus.registerRequestHandler(
            'sign-message',
            getSignMessageHandler(queue, state)
        );

        bus.registerRequestHandler('sign', getSignHandler(queue, state) as any);

        bus.dispatchEvent('ready', void 0);

        window.addEventListener('unload', () => {
            bus.dispatchEvent('close', undefined);
        });
    })
    .catch(console.error);
