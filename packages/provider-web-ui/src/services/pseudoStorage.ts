let storageLength = 0;

export const pseudoStorage: Storage = {
    items: Object.create(null),
    getItem(key: string): string | null {
        return this.items[key];
    },
    key(index: number): string | null {
        return Object.keys(this.items).find((k, i) => index === i) || null;
    },
    length: storageLength,
    removeItem(key: string): void {
        storageLength = storageLength - 1;
        this.items[key] = undefined;
    },
    setItem(key: string, value: string): void {
        storageLength = storageLength + 1;
        this.items[key] = value;
    },
    clear(): void {
        storageLength = 0;
        this.items = Object.create(null);
    },
};
