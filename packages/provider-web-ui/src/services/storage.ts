import { catchable, TCatchable } from '../utils/catchable';
import { createMultiAccountHash } from '../utils/createMultiAccountHash';
import { decryptMultiAccountData } from '../utils/decryptMultiAccountData';
import { encryptMultiAccountData } from '../utils/encryptMultiAccountData';
import { IUserStorageInfo, TPrivateMultiaccountData } from '../interface';

class StorageService {
    private storageOrigin: Storage = localStorage;

    public setStorageOrigin(_storage: Storage): void {
        this.storageOrigin = _storage;
    }

    private static readonly serializer: TSerializer = {
        termsAccepted: (accepted) => String(accepted),
        multiAccountUsers: (data) => JSON.stringify(data),
    };

    private static readonly parser: TParser = {
        termsAccepted: (accepted) => accepted === 'true',
        multiAccountUsers: (data) => JSON.parse(data || '{}') || {},
    };

    public update(storage: Partial<IStorage>): void {
        Object.entries(storage).forEach(([key, value]) => {
            if (value != null) {
                this.set(key as keyof IStorage, value);
            }
        });
    }

    public set<Key extends keyof IStorage>(
        key: Key,
        value: IStorage[Key]
    ): void {
        this.storageOrigin.setItem(
            key,
            (StorageService.serializer[key] as any)(value)
        ); // TODO
    }

    public get<Key extends keyof IStorage>(key: Key): IStorage[Key] {
        return StorageService.parser[key](
            this.storageOrigin.getItem(key)
        ) as any; // TODO
    }

    public setPrivateData(
        data: TPrivateMultiaccountData,
        password: string,
        rounds?: number
    ): void {
        const json = JSON.stringify(data);
        const hash = createMultiAccountHash(json);
        const encrypted = encryptMultiAccountData(data, password, rounds);

        this.storageOrigin.setItem('multiAccountHash', `"${hash}"`);
        this.storageOrigin.setItem('multiAccountData', `"${encrypted}"`);
    }

    public getPrivateData(
        password: string,
        rounds?: number
    ): TCatchable<TPrivateMultiaccountData> {
        const encrypted = JSON.parse(
            this.storageOrigin.getItem('multiAccountData') || 'null'
        );
        const hash = JSON.parse(
            this.storageOrigin.getItem('multiAccountHash') || 'null'
        );

        if (!hash || !encrypted) {
            return {
                ok: true,
                resolveData: {},
                rejectData: null,
            };
        }

        return catchable(decryptMultiAccountData)(
            encrypted,
            hash,
            password,
            rounds
        );
    }

    public changePassword(
        from: IPasswordData,
        to: IPasswordData
    ): TCatchable<void> {
        const data = this.getPrivateData(from.password, from.rounds);

        if (!data.ok) {
            return data;
        }

        this.setPrivateData(data.resolveData, to.password, to.rounds);

        return {
            ok: true,
            rejectData: null,
            resolveData: void 0,
        };
    }

    public hasPrivateData(): boolean {
        const encrypted = JSON.parse(
            this.storageOrigin.getItem('multiAccountData') || 'null'
        );
        const hash = JSON.parse(
            this.storageOrigin.getItem('multiAccountHash') || 'null'
        );

        return !!hash && !!encrypted;
    }
}

export const storage = new StorageService();

interface IPasswordData {
    password: string;
    rounds?: number;
}

export interface IStorage {
    termsAccepted: boolean;
    multiAccountUsers: Record<string, IUserStorageInfo>;
}

type TSerializer = {
    [Key in keyof IStorage]: (
        data: IStorage[Key]
    ) => IStorage[Key] extends undefined ? string | undefined : string;
};

type TParser = {
    [Key in keyof IStorage]: (data: string | null) => IStorage[Key];
};
