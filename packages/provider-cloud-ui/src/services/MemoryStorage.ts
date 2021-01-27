import { ICognitoStorage } from 'amazon-cognito-identity-js';

export class MemoryStorage implements ICognitoStorage {
    private dataMemory: Record<string, string> = {};

    public setItem(key: string, value: string): void {
        this.dataMemory[key] = value;
    }

    public getItem(key: string): string | null {
        return Object.prototype.hasOwnProperty.call(this.dataMemory, key)
            ? this.dataMemory[key]
            : null;
    }

    public removeItem(key: string): void {
        delete this.dataMemory[key];
    }

    public clear(): void {
        this.dataMemory = {};
    }
}
