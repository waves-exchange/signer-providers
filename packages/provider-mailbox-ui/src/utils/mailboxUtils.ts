import { libs, seedUtils } from '@waves/waves-transactions';
import * as identityImg from 'identity-img';

const {
    keyPair,
    base58Encode,
    base58Decode,
    blake2b,
    sharedKey: sharedKeyFunc,
    messageDecrypt,
    messageEncrypt,
} = libs.crypto;

export const sharedKey = sharedKeyFunc;

export function generateKeyPair(): ReturnType<typeof keyPair> {
    return keyPair(seedUtils.Seed.create().phrase);
}

export function createIdenticonKey(key: string): string {
    return identityImg.create(key, {
        rows: 6,
        cells: 6,
        size: 200,
        bgColor: 'black',
        mainColor: 'blue',
        nanColor: 'black',
        mainStep: 10,
    });
}

export function hash(str: string): string {
    return base58Encode(blake2b(base58Decode(str)));
}

interface IDecryptParams {
    publicKey: string;
    privateKey: string;
    code: string;
    value: string;
}

export function decrypt<T = Record<string, unknown>>({
    publicKey,
    privateKey,
    code,
    value,
}: IDecryptParams): T {
    return JSON.parse(
        messageDecrypt(
            sharedKey(privateKey, publicKey, code),
            base58Decode(value)
        )
    );
}

interface IEncryptParams<T> {
    publicKey: string;
    privateKey: string;
    code: string;
    value: T;
}

export function encrypt<T = Record<string, unknown>>({
    publicKey,
    privateKey,
    code,
    value,
}: IEncryptParams<T>): string {
    return base58Encode(
        messageEncrypt(
            sharedKey(privateKey, publicKey, code),
            JSON.stringify(value)
        )
    );
}
