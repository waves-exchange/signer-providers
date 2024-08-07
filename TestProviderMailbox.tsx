import React, { useEffect, useMemo } from 'react';
import { Signer } from '@waves/signer';
import { ProviderMailbox } from './packages/provider-mailbox/src';

const url = location.href.includes('provider=exchange')
    ? 'https://wallet-stage2.waves.exchange/signer-mailbox'
    : location.origin + '/packages/provider-mailbox-ui/index.html';

const node = location.href.includes('mainnet')
    ? 'https://nodes.wavesnodes.com'
    : 'https://nodes-testnet.wavesnodes.com';

export function TestProviderMailbox(): React.ReactElement {
    const provider = useMemo(() => new ProviderMailbox(url, true), []);
    const signer = useMemo(() => new Signer({ NODE_URL: node }), []);

    useEffect((): void => {
        signer.setProvider(provider);
    }, [provider, signer]);

    useEffect((): () => void => {
        return ((): void => {
            if (provider.user) {
                provider.logout();
            }
        });
    }, []);

    return (
        <div>
            <h1>Provider Mailbox</h1>
            <div>
                <h1>Login</h1>
                <button
                    onClick={() => {
                        signer.login();
                    }}
                >
                    Login
                </button>
            </div>

            <div>
                <h2>Logout</h2>
                <button
                    onClick={() => {
                        signer.logout();
                    }}
                >
                    Logout
                </button>
            </div>

        </div>
    );
}
