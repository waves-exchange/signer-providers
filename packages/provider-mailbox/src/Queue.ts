interface IQueueItem {
    action: () => Promise<void>;
    reject: (error: Error) => void;
}

export interface IQueue {
    length: number;
    push<T>(action: () => Promise<T>): Promise<T>;
    canPush(): boolean;
    clear(error?: Error | string): void;
}

export class Queue implements IQueue {
    public get length(): number {
        return this._actions.length + (this._active == null ? 0 : 1);
    }
    private readonly _actions: Array<IQueueItem> = [];
    private readonly _maxLength: number;
    private _active: Promise<void> | undefined;

    constructor(maxLength: number) {
        this._maxLength = maxLength;
    }

    public push<T>(action: () => Promise<T>): Promise<T> {
        if (this._actions.length >= this._maxLength) {
            throw new Error("Cant't push action! Queue is full!");
        }

        return new Promise((resolve, reject) => {
            const onEnd = (): void => {
                this._active = undefined;
                const index = this._actions
                    .map((x) => x.action)
                    .indexOf(actionCallback); // eslint-disable-line @typescript-eslint/no-use-before-define

                if (index !== -1) {
                    this._actions.splice(index, 1);
                }

                this.run();
            };

            const actionCallback = (): Promise<void> =>
                action().then(
                    (res) => {
                        onEnd();
                        resolve(res);
                    },
                    (err) => {
                        onEnd();
                        reject(err);
                    }
                );

            this._actions.push({ action: actionCallback, reject });

            if (this.length === 1) {
                this.run();
            }
        });
    }

    public clear(error?: Error | string): void {
        error = error || new Error('Rejection with clear queue!');
        const e = typeof error === 'string' ? new Error(error) : error;

        this._actions
            .splice(0, this._actions.length)
            .forEach((item) => item.reject(e));

        this._active = undefined;
    }

    public canPush(): boolean {
        return this._actions.length < this._maxLength;
    }

    private run(): void {
        const item = this._actions.shift();

        if (item == null) {
            return void 0;
        }

        this._active = item.action();
    }
}

interface IQueueItem {
    action: () => Promise<void>;
    reject: (error: Error) => void;
}
