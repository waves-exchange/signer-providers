import { catchable, TCatchable } from '../utils/catchable';
import { createMultiAccountHash } from '../utils/createMultiAccountHash';
import { decryptMultiAccountData } from '../utils/decryptMultiAccountData';
import { encryptMultiAccountData } from '../utils/encryptMultiAccountData';
import { IUserStorageInfo, TPrivateMultiaccountData } from '../interface';
import { getPrivateData } from './getPrivateData';

class StorageService {
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
        localStorage.setItem(
            key,
            (StorageService.serializer[key] as any)(value)
        ); // TODO
    }

    public get<Key extends keyof IStorage>(key: Key): IStorage[Key] {
        return StorageService.parser[key](localStorage.getItem(key)) as any; // TODO
    }

    public setPrivateData(
        data: TPrivateMultiaccountData,
        password: string,
        rounds?: number
    ): void {
        const json = JSON.stringify(data);
        const hash = createMultiAccountHash(json);
        const encrypted = encryptMultiAccountData(data, password, rounds);

        localStorage.setItem('multiAccountHash', `"${hash}"`);
        localStorage.setItem('multiAccountData', `"${encrypted}"`);
    }

    public getPrivateData(
        password: string,
        rounds?: number
    ): TCatchable<TPrivateMultiaccountData> {
        return getPrivateData(
            password,
            localStorage.getItem('multiAccountData'),
            localStorage.getItem('multiAccountHash'),
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
            localStorage.getItem('multiAccountData') || 'null'
        );
        const hash = JSON.parse(
            localStorage.getItem('multiAccountHash') || 'null'
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
