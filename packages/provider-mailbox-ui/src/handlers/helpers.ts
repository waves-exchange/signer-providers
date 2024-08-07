import React from 'react';
import renderPage from '../utils/renderPage';
import { IQueue, Preload } from '@waves.exchange/provider-ui-components';

export const preload = (): void => {
    renderPage(React.createElement(Preload));
};

export const toQueue = <T extends (data?: any) => Promise<any>>(
    queue: IQueue,
    handler: T
): ((data?: TParam<T>) => Promise<TReturn<T>>) => {
    return (data?: TParam<T>): Promise<TReturn<T>> => {
        const action = (): Promise<TReturn<T>> => {
            return handler(data);
        };

        if (queue.canPush()) {
            return queue.push(action);
        } else {
            return Promise.reject('Queue is full!');
        }
    };
};

type TParam<T> = T extends (data: infer PARAM) => Promise<any> ? PARAM : never;
type TReturn<T> = T extends (data: any) => Promise<infer RETURN>
    ? RETURN
    : never;
