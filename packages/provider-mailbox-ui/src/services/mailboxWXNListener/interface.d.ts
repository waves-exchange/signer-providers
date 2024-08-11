import { ICreateConnectionParams } from '../mailbox/interface';

export interface ICreateConnectionListenersParams
    extends ICreateConnectionParams {
    onMsg?: (data: IReceivedMsg) => void;
}

export interface ICallbacks {
    onOpen: Array<ICreateConnectionListenersParams['onOpen']>;
    onClose: Array<ICreateConnectionListenersParams['onClose']>;
    onError: Array<ICreateConnectionListenersParams['onError']>;
    onCreate: Array<ICreateConnectionListenersParams['onCreate']>;
    onMsg: Array<ICreateConnectionListenersParams['onMsg']>;
}
