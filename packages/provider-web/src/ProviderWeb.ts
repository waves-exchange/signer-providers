import {
    AuthEvents,
    ConnectOptions,
    Handler,
    Provider,
    SignedTx,
    SignerTx,
    TypedData,
    UserData,
} from '@waves/signer';
import { Bus, config, WindowAdapter } from '@waves/waves-browser-bus';
import { EventEmitter } from 'typed-ts-events';
import { ITransport } from './interface';
import { TransportIframe } from './TransportIframe';
import { createError } from './createError';
import { removeStorage, setStorage, transferStorage } from './TransferStorage';

export class ProviderWeb implements Provider {
    public user: UserData | null = null;
    private readonly _transport: ITransport<HTMLIFrameElement>;
    private readonly _clientUrl: string;
    private readonly emitter: EventEmitter<AuthEvents> = new EventEmitter<AuthEvents>();

    constructor(clientUrl?: string, logs?: boolean) {
        this._clientUrl =
            (clientUrl || 'https://waves.exchange/signer/') +
            ((import.meta as any).env.PROD
                ? `?${ProviderWeb._getCacheClean()}`
                : '');

        this._transport = new TransportIframe(this._clientUrl, 3);

        if (logs === true) {
            config.console.logLevel = config.console.LOG_LEVEL.VERBOSE;
        }
    }

    private static _getCacheClean(): string {
        return String(Date.now() % (1000 * 60));
    }

    public on<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>
    ): Provider {
        this.emitter.on(event, handler);

        return this;
    }

    public once<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>
    ): Provider {
        this.emitter.once(event, handler);

        return this;
    }

    public off<EVENT extends keyof AuthEvents>(
        event: EVENT,
        handler: Handler<AuthEvents[EVENT]>
    ): Provider {
        this.emitter.once(event, handler);

        return this;
    }

    public connect(options: ConnectOptions): Promise<void> {
        return Promise.resolve(
            this._transport.sendEvent((bus) =>
                bus.dispatchEvent('connect', options)
            )
        );
    }

    public logout(): Promise<void> {
        this.user = null;

        return Promise.resolve(this._transport.dropConnection());
    }

    public login(): Promise<any> {
        if (this.user) {
            return Promise.resolve(this.user);
        }

        const iframe = this._transport.get();

        const win = window.open(
            this._clientUrl,
            '_blank',
            'width=200,height=200,location=no,scrollbars=no'
        );

        if (!win) {
            throw new Error('Window was blocked');
        }

        iframe.src = `${this._clientUrl}?transferWindow=true`;

        return transferStorage(win).then((data) => {
            setStorage(data);

            return this._transport.dialog((bus) =>
                bus
                    .request('login')
                    .then((userData) => {
                        this.user = userData;
                        removeStorage(data);

                        return userData;
                    })
                    .catch((err) => {
                        this._transport.dropConnection();

                        return Promise.reject(createError(err));
                    })
            );
        });
    }

    public signMessage(data: string | number): Promise<string> {
        return this.login().then(() =>
            this._transport.dialog((bus) => bus.request('sign-message', data))
        );
    }

    public signTypedData(data: Array<TypedData>): Promise<string> {
        return this.login().then(() =>
            this._transport.dialog((bus) =>
                bus.request('sign-typed-data', data)
            )
        );
    }

    public sign<T extends Array<SignerTx>>(toSign: T): Promise<SignedTx<T>> {
        return this.login().then(() =>
            this._transport.dialog((bus) => bus.request('sign', toSign))
        );
    }
}
