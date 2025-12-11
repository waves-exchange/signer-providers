import {
    ConnectOptions,
    SignedTx,
    SignerTx,
    TypedData,
    UserData,
} from '@waves/signer';
import { Bus } from '@waves/waves-browser-bus';
import { order } from '@waves/waves-transactions';

export interface IStorageTransferData {
    multiAccountUsers: string | null;
    multiAccountHash: string | null;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TBusHandlers = {
    login: (data?: IStorageTransferData) => Promise<UserData>;

    'sign-custom-bytes': (data: string) => Promise<string>;
    'sign-message': (data: string | number) => Promise<string>;
    'sign-typed-data': (data: Array<TypedData>) => Promise<string>;
    'sign-order': (data: TOrderArgs) => Promise<TSignedOrder>;

    sign<T extends Array<SignerTx>>(
        list: T
    ): Promise<{ [Key in keyof T]: SignedTx<T[Key]> }>;
};

export interface IBusEvents {
    connect: ConnectOptions;
    close: void;
    ready: void;
    passLoginData: void;
    catchStorage: void;
}

export type TBus = Bus<IBusEvents, TBusHandlers>;

export interface ITransport<T> {
    get(): T;
    dialog<T>(callback: (bus: TBus) => Promise<T>): Promise<T>;
    sendEvent(callback: (bus: TBus) => unknown): void;
    dropConnection(): void;
}

export type TOrderArgs = Parameters<typeof order>[0];
export type TSignedOrder = ReturnType<typeof order>;
