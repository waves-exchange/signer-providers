import { Mailbox } from './Mailbox';
import { ICreateConnectionParams } from './interface';

export class ConnectMailbox extends Mailbox {
    public connect(id: number, cbParams?: ICreateConnectionParams): void {
        const _params = cbParams || Object.create(null);

        this.createConnection({
            ..._params,
            onOpen: () => {
                this.sendConnectMsg(id);
                if (typeof cbParams?.onOpen === 'function') {
                    cbParams.onOpen();
                }
            },
        });
    }
}
