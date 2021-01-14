import Signer from '@waves/signer';
import { ProviderCloud } from './provider';

const url = location.href.includes('provider=exchange')
    ? 'https://waves.exchange/signer-cloud'
    : location.origin + '/src/iframe-entry/index.html';

const node = location.href.includes('mainnet')
    ? 'https://nodes.wavesplatform.com'
    : 'https://nodes-testnet.wavesnodes.com';

const provider = new ProviderCloud(url, true);
const waves = new Signer({ NODE_URL: node });

// eslint-disable-next-line @typescript-eslint/no-floating-promises
waves.setProvider(provider);

const getByElement = function<T>(
    element: HTMLElement,
    key: string,
    defaultValue: T
): T {
    return (element.dataset[key.toLowerCase()] || defaultValue) as T;
};

(window as any).transfer = (element: HTMLElement): any => {
    return waves
        .transfer({
            amount: getByElement(element, 'amount', 1),
            recipient: getByElement(element, 'recipient', 'merry'),
            assetId: getByElement(element, 'assetId', undefined),
            feeAssetId: getByElement(element, 'feeAssetId', undefined),
            fee: getByElement(element, 'fee', undefined),
            attachment: getByElement(element, 'attachment', ''),
        })
        .broadcast();
};

(window as any).waves = waves;
