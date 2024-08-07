import { Mailbox } from './Mailbox';
import { ICreateConnectionParams } from './interface';

export class CreateMailbox extends Mailbox {
    public connect(cbParams?: ICreateConnectionParams): void {
        const _params = cbParams || Object.create(null);

        this.createConnection({
            ..._params,
            onOpen: () => {
                this.sendCreateMsg();
                if (typeof cbParams?.onOpen === 'function') {
                    cbParams.onOpen();
                }
            },
        });
    }
}
