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
                <h2>Transfer 0.1 Tether USD Waves to Merry</h2>
                <div>
                    <button
                        onClick={() => {
                            signer
                                .transfer({
                                    amount: 100000,
                                    // assetId: '5Sh9KghfkZyhjwuodovDhB6PghDUGBHiAPZ4MkrPgKtX',
                                    assetId: 'YYZpFWWkedkhSYsQeFkKgGQJs1w9yEy3At33rUVD1QM',
                                    // recipient: 'merry',
                                    recipient: '3Mqtn6v9na7hgbRXbuwNCH28rAr44VxB4ih',
                                    attachment: null,
                                })
                                .broadcast();
                        }}
                    >
                        Basic
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => {
                            signer
                                .transfer({
                                    amount: 10000000,
                                    // recipient: 'merry',
                                    recipient: '3Mqtn6v9na7hgbRXbuwNCH28rAr44VxB4ih',
                                    feeAssetId: '25FEqEjRkqK6yCkiT7Lz6SAYz7gUFCtxfCChnrVFD5AT',
                                    attachment: null,
                                })
                                .broadcast();
                        }}
                    >
                        With custom Fee feeAssetId
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => {
                            signer
                                .transfer({
                                    amount: 10000000,
                                    recipient: '3Mqtn6v9na7hgbRXbuwNCH28rAr44VxB4ih',
                                        // '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
                                    attachment: null,
                                    fee: 676767,
                                })
                                .broadcast();
                        }}
                    >
                        With custom Fee amount
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => {
                            signer
                                .transfer({
                                    amount: 10000000,
                                    recipient: '3Mqtn6v9na7hgbRXbuwNCH28rAr44VxB4ih',
                                        // '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
                                    attachment: '72k1xXWG59fYdzSNoA',
                                })
                                .broadcast();
                        }}
                    >
                        By address With attachment
                    </button>
                </div>
            </div>

            <div>
                <h2>Sign massTransfer</h2>
                <button
                    onClick={() => {
                        signer
                            .massTransfer({
                                assetId:
                                    'YYZpFWWkedkhSYsQeFkKgGQJs1w9yEy3At33rUVD1QM',
                                transfers: [
                                    {
                                        amount: 10,
                                        recipient: 'merry',
                                    },
                                    {
                                        amount: 20,
                                        recipient:
                                            '3NCPkdHiodCM5VMQrc8y2mjkhUcgjZapuJx',
                                    },
                                ],
                                attachment: '72k1xXWG59fYdzSNoA',
                            })
                            .broadcast();
                    }}
                >
                    massTransfer
                </button>
            </div>

            <div>
                <h2>Invoke</h2>
                <div>
                    <button
                        onClick={() => {
                            signer
                                .invoke({
                                    dApp: 'alias:T:merry',
                                    payment: [{ assetId: 'WAVES', amount: 1 }],
                                    call: {
                                        function: 'test',
                                        args: [
                                            { type: 'string', value: 'string' },
                                            { type: 'integer', value: 123123123 },
                                            { type: 'boolean', value: true },
                                            {
                                                type: 'binary',
                                                value:
                                                    'base64:AAIDAAAAAAAAAAQIARIAAAAAAAAAAAEAAAABaQEAAAADZm9vAAAAAAkBAAAACFdyaXRlU2V0AAAAAQUAAAADbmlsAAAAACvwfcA=',
                                            },
                                        ],
                                    },
                                    fee: 1000,
                                })
                                .broadcast();
                        }}
                    >
                        Invoke
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => {
                            signer
                                .invoke({
                                    dApp: '3Mw8ZcMK47vENHqhYYhCZTCPDXhff6ZQVwt',
                                    payment: [{ assetId: 'YYZpFWWkedkhSYsQeFkKgGQJs1w9yEy3At33rUVD1QM', amount: 1000000 }],
                                    call: {
                                        function: 'stake',
                                        args: [],
                                    },
                                    fee: 500000,
                                })
                                .broadcast();
                        }}
                    >
                        Stake 0.01 USDT
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => {
                            signer
                                .invoke({
                                    dApp: '3Mw8ZcMK47vENHqhYYhCZTCPDXhff6ZQVwt',
                                    payment: [],
                                    call: {
                                        function: 'unstake',
                                        args: [{ type: 'integer', value: 1000000 }],
                                    },
                                    fee: 500000,
                                })
                                .broadcast();
                        }}
                    >
                        Unstake 0.01 USDT
                    </button>
                </div>
            </div>

            <div>
                <h2>Lease</h2>
                <button
                    onClick={() => {
                        signer
                            .lease({
                                amount: 107728840,
                                recipient:
                                    '3Mz9N7YPfZPWGd4yYaX6H53Gcgrq6ifYiH7',
                            })
                            .broadcast();
                    }}
                >
                    Lease
                </button>
                <button
                    onClick={() => {
                        signer
                            .lease({
                                amount: 107728840,
                                recipient: 'alias:T:merry',
                            })
                            .broadcast();
                    }}
                >
                    Lease to Merry by alias
                </button>
            </div>

            <div>
                <h2>Cancel Lease</h2>
                <button
                    onClick={() => {
                        signer
                            .cancelLease({
                                leaseId:
                                    '4VVLVYWzDa3ntpk6DfYsVePj2C2WNg47mHPNCm8xuES9',
                            })
                            .broadcast();
                    }}
                >
                    Cancel Lease
                </button>
            </div>

            <div>
                <h2>Sign Set Asset Script</h2>
                <button
                    onClick={() => {
                        signer
                            .setAssetScript({
                                assetId:
                                    '8oW25aejCY2T2JSL7nwchEkKykH5LJ59mbTMHvUbbzHB',
                                // script: 'base64:BQbtKNoM',
                                script: 'base64:BQe02cAZ',
                            })
                            .broadcast();
                    }}
                >
                    Set asset script
                </button>
            </div>

            <div>
                <h2>Sign Burn</h2>
                <button
                    onClick={() => {
                        signer
                            .burn({
                                assetId:
                                    '9457rs52YU52oEYySuFYztNBaFkEMyXuknZF4kDx79qC',
                                amount: 1,
                            })
                            .broadcast();
                    }}
                >
                    Burn
                </button>
            </div>

            <div>
                <h2>Sign Issue</h2>
                <button
                    onClick={() => {
                        signer
                            .issue({
                                name: 'Name of Token',
                                decimals: 2,
                                quantity: 1000,
                                reissuable: false,
                                description: 'Description of token',
                                script: 'base64:BQe02cAZ',
                            })
                            .broadcast();
                    }}
                >
                    Sign issue
                </button>
            </div>

            <div>
                <h2>Reissue</h2>
                <button
                    onClick={() => {
                        signer
                            .reissue({
                                assetId:
                                    'DAimjDKFxVrLKBCPPF8cUHf8FRc2j64XaXxEiBo7JUwV',
                                quantity: 100000000000,
                                reissuable: true,
                            })
                            .broadcast();
                    }}
                >
                    Sign Reissue
                </button>
            </div>

            <div>
                <h2>Sponsorship</h2>
                <button
                    onClick={() => {
                        signer
                            .sponsorship({
                                assetId:
                                    'DAimjDKFxVrLKBCPPF8cUHf8FRc2j64XaXxEiBo7JUwV',
                                minSponsoredAssetFee: 123,
                            })
                            .broadcast();
                    }}
                >
                    Sign Sponsorship Enable
                </button>

                <button
                    onClick={() => {
                        signer
                            .sponsorship({
                                assetId:
                                    'DAimjDKFxVrLKBCPPF8cUHf8FRc2j64XaXxEiBo7JUwV',
                                minSponsoredAssetFee: 0,
                            })
                            .broadcast();
                    }}
                >
                    Sign Sponsorship Disable
                </button>
            </div>

            <div>
                <h2>Alias</h2>
                <button
                    onClick={() => {
                        signer.alias({ alias: 'new_alias_from_signer' }).broadcast();
                    }}
                >
                    Sign Alias
                </button>
            </div>

            <div>
                <h2>Account Script</h2>
                <button
                    onClick={() => {
                        signer
                            .setScript({
                                script:
                                    'base64:BQkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAAIBQAAAAJ0eAAAAA9zZW5kZXJQdWJsaWNLZXlzTh3b',
                            })
                            .broadcast();
                    }}
                >
                    Set Script
                </button>
            </div>

            <div>
                <h2>Data</h2>
                <button
                    onClick={() => {
                        signer
                            .data({
                                data: [
                                    {
                                        key: 'key1',
                                        value: 'world',
                                        type: 'string',
                                    },
                                    {
                                        key: 'key2',
                                        value: 'world',
                                        type: 'string',
                                    },
                                    {
                                        key: 'key3',
                                        value: 'world',
                                        type: 'string',
                                    },
                                    {
                                        key: 'AAAAAAAAAAAEAAAABaQEAAAADZm9v',
                                        value: 'world',
                                        type: 'string',
                                    },
                                    {
                                        key: 'key4',
                                        value: 123123123,
                                        type: 'integer',
                                    },
                                    {
                                        key: 'key5',
                                        value: true,
                                        type: 'boolean',
                                    },
                                ],
                            })
                            .broadcast();
                    }}
                >
                    Data
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
