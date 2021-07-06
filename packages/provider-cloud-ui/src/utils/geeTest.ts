const getConfig = (): { isBotByDefault: boolean; url: string } => {
    return {
        isBotByDefault: true,
        url: 'https://geetest.waves.exchange/register',
    };
};

const w = window as any;

export const getGeeTestToken = (): Promise<{
    geetest_challenge: string;
    geetest_seccode: string;
    geetest_validate: string;
}> => {
    return new Promise((res, rej) => {
        const { url } = getConfig();

        try {
            fetch(url).then(async (response: any) => {
                const data = await response
                    .text()
                    .then((text: any) => JSON.parse(text));

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
                        geeTestObj.onSuccess(() =>
                            res(geeTestObj.getValidate())
                        );
                        geeTestObj.onError(rej);
                        geeTestObj.onClose(rej);
                    },
                    rej
                );
            }, rej);
        } catch (e) {
            rej(e);
        }
    });
};
