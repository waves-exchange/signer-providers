import './geeTestCode';
import { utils } from '@waves.exchange/provider-ui-components';
import { Bus, WindowAdapter, WindowProtocol } from '@waves/waves-browser-bus';

const w = window as any;
const { isBrave, isSafari } = utils;

const fetchFromNewWindow = (url: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const win = w.open(location.origin + '/signer-cloud');

        if (!win) {
            throw new Error('Window was blocked');
        }

        const adapter = new WindowAdapter(
            [new WindowProtocol(window, WindowProtocol.PROTOCOL_TYPES.LISTEN)],
            []
        );
        const bus = new Bus(adapter);

        bus.once('ready', () => {
            const requestAdapter = new WindowAdapter(
                [new WindowProtocol(win, WindowProtocol.PROTOCOL_TYPES.LISTEN)],
                [
                    new WindowProtocol(
                        window,
                        WindowProtocol.PROTOCOL_TYPES.DISPATCH
                    ),
                ]
            );
            const requestBus = new Bus(requestAdapter);

            requestBus
                .request('fetchData', url, -1)
                .then((data) => {
                    resolve(data);
                    win.close();
                })
                .catch((e) => {
                    reject(e);
                    win.close();
                });
        });
    });
};

export const fetchGeeTestToken = (url: string): Promise<any> => {
    return fetch(url, { credentials: 'include' })
        .then((response) => {
            return Promise.all([response.json(), response]);
        })
        .then(([data, response]) => {
            if (!response.ok) {
                return Promise.reject(data);
            }

            return data;
        });
};

export const getGeeTestToken = (
    geetestUrl: string,
    useGeeTest = true
): Promise<{
    geetest_challenge: string;
    geetest_seccode: string;
    geetest_validate: string;
}> => {
    if (!useGeeTest) {
        return Promise.resolve({
            geetest_challenge: '',
            geetest_seccode: '',
            geetest_validate: '',
        });
    }

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (res, rej) => {
        try {
            let data;

            if (w !== w.top && !w.opener) {
                data = await fetchFromNewWindow(geetestUrl);
            } else {
                data = await fetchGeeTestToken(geetestUrl);
            }

            if (!w.initGeetest) {
                return rej();
            }

            w.initGeetest(
                {
                    gt: data.gt,
                    lang: 'en',
                    hideSuccess: true,
                    hideClose: false,
                    challenge: data.challenge,
                    offline: !data.success,
                    new_captcha: true,
                    product: 'bind',
                    onError: rej,
                },
                function (geeTestObj: any) {
                    if (!geeTestObj) {
                        return rej();
                    }
                    geeTestObj.appendTo('body');
                    geeTestObj.onReady(() => geeTestObj.verify());
                    geeTestObj.onSuccess(() => res(geeTestObj.getValidate()));
                    geeTestObj.onError(rej);
                    geeTestObj.onClose(rej);
                },
                rej
            );
        } catch (e) {
            rej(e);
        }
    });
};
