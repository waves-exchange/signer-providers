import { AddressAvatar } from '@waves.exchange/react-uikit';
import React from 'react';

export interface ISignCustomProps<T> {
    networkByte: number;
    sender: string;
    title: string;
    data: T;
    onConfirm: () => void;
    onCancel: () => void;
}

export function SignCustom<T>(props: ISignCustomProps<T>): React.ReactElement {
    return (
        <div>
            <div onClick={props.onCancel} />
            <div className="logo" />
            <div>{props.title}</div>

            <div>
                <span>Sign from</span>
                <span>
                    <AddressAvatar address={props.sender} />
                </span>
            </div>

            {props.data}

            <div>
                <button onClick={props.onCancel}>Cancel</button>
                <button onClick={props.onConfirm}>Ok</button>
            </div>
        </div>
    );
}
