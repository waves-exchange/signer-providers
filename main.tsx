import React, { useEffect, useMemo } from 'react';
import { render } from 'react-dom';
import { Signer } from '@waves/signer';
import { ProviderCloud } from './packages/provider-cloud/src';

const url = location.href.includes('provider=exchange')
    ? 'https://signer.exchange/signer-cloud'
    : location.origin + '/packages/provider-cloud-ui/index.html';

const node = location.href.includes('mainnet')
    ? 'https://nodes.wavesplatform.com'
    : 'https://nodes-testnet.wavesnodes.com';

function TestApp(): React.ReactElement {
    const provider = useMemo(() => new ProviderCloud(url, true), []);
    const signer = useMemo(() => new Signer({ NODE_URL: node }), []);

    useEffect(() => {
        signer.setProvider(provider);
    }, [provider, signer]);

    return (
        <div>
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
                <h2>Sign Set Asset Script</h2>
                <button
                    onClick={() => {
                        signer
                            .setAssetScript({
                                assetId:
                                    '9FKPH2PVQXpe8cuHHJkMKJMxdCmFZrPZftZTkPzhYXtj',
                                script: '12345678',
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
                                    '9FKPH2PVQXpe8cuHHJkMKJMxdCmFZrPZftZTkPzhYXtj',
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
                                script:
                                    'base64:AAIDAAAAAAAAAAQIARIAAAAAAAAAAAEAAAABaQEAAAADZm9vAAAAAAkBAAAACFdyaXRlU2V0AAAAAQUAAAADbmlsAAAAACvwfcA=',
                            })
                            .broadcast();
                    }}
                >
                    Sign issue
                </button>
            </div>

            <div>
                <h2>Sign massTransfer</h2>
                <button
                    onClick={() => {
                        signer
                            .massTransfer({
                                assetId:
                                    'BC2RVCn2NzoWM8s5MVr2Tns9EmcxL6guMgnDWy3Uj8nA',
                                transfers: [
                                    {
                                        amount: 10,
                                        recipient: 'merry',
                                    },
                                    {
                                        amount: 20,
                                        recipient:
                                            '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
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
                <h2>Transfer 1 Waves to Merry</h2>
                <div>
                    <button
                        onClick={() => {
                            signer
                                .transfer({
                                    amount: 10000000,
                                    recipient: 'merry',
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
                                    recipient: 'merry',
                                    feeAssetId:
                                        'WAVES',
                                    attachment: null,
                                })
                                .broadcast();
                        }}
                    >
                        With feeAssetId = 'WAVES'
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => {
                            signer
                                .transfer({
                                    amount: 10000000,
                                    recipient:
                                        '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
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
                                    recipient:
                                        '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
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
                <h2>Invoke</h2>
                <button
                    onClick={() => {
                        signer
                            .invoke({
                                dApp: '3N27HUMt4ddx2X7foQwZRmpFzg5PSzLrUgU',
                                fee: 500001,
                                feeAssetId: 'WAVES',
                                payment: [
                                    {assetId: 'WAVES', amount: 12345 },
                                    {assetId: '25FEqEjRkqK6yCkiT7Lz6SAYz7gUFCtxfCChnrVFD5AT', amount: 123 },
                                    {assetId: '5Sh9KghfkZyhjwuodovDhB6PghDUGBHiAPZ4MkrPgKtX', amount: 234 }
                                ],
                                call: {
                                    function: 'tellme',
                                    args: [{
                                        type: 'string',
                                        value: 'Some text',
                                    }],
                                }
                            })
                            .broadcast();
                    }}
                >
                    Invoke
                </button>
            </div>
            <div>
                <h2>Invoke2 Eggs</h2>
                <button
                    onClick={() => {
                        signer
                            .invoke({
                                "payment": [
                                    {"assetId":"JCGDtrVy64cCJ1wCKfCaiNQMnyYwii71TbE5QeAHfxgF","amount":100}
                                ],
                                "dApp":"3P8huQdLQVthshCthDLXxdGcy3YJ3UP5APY",
                                "call":{
                                    "function":"provideLiquidity","args":[]
                                },
                                "feeAssetId":null,
                                "type": 16
                            })
                            .broadcast();
                    }}
                >
                    Invoke egg
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
                <h2>Sign Message</h2>
                <button
                    onClick={() => {
                        signer.signMessage(
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et lacinia augue. Nulla eu diam orci. Suspendisse dapibus porttitor tellus id mattis. Phasellus vitae condimentum justo. Maecenas et ultricies libero. Donec vitae lacus lectus. Cras sem felis, pretium sed lacinia ac, congue quis ipsum. Etiam eget auctor sapien, vel accumsan nisi. Aenean ac risus sit amet nulla lacinia ullamcorper ut ac nunc. Suspendisse potenti. Donec dolor diam, hendrerit in ligula cursus, vestibulum tristique mauris. Vestibulum vitae congue risus, quis placerat est.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et lacinia augue. Nulla eu diam orci. Suspendisse dapibus porttitor tellus id mattis. Phasellus vitae condimentum justo. Maecenas et ultricies libero. Donec vitae lacus lectus. Cras sem felis, pretium sed lacinia ac, congue quis ipsum. Etiam eget auctor sapien, vel accumsan nisi. Aenean ac risus sit amet nulla lacinia ullamcorper ut ac nunc. Suspendisse potenti. Donec dolor diam, hendrerit in ligula cursus, vestibulum tristique mauris. Vestibulum vitae congue risus, quis placerat est.'
                        );
                    }}
                >
                    Sign Lorem ipsum dolor sit amet...
                </button>
            </div>

            <div>
                <h2>Sign Data</h2>
                <button
                    onClick={() => {
                        signer.signTypedData([
                            {
                                key: 'BackChat',
                                value: 'base64:BzWHaQUaGVsd29AAAAAAAA',
                                type: 'string',
                            },
                            {
                                key: 'CallingAllGirls',
                                value: 'false',
                                type: 'string',
                            },
                            { key: 'Jealousy', value: 'world', type: 'string' },
                            {
                                key: 'AAAAAAAAAAAEAAAABaQEAAAADZm9v',
                                value: 'Oh Waves, Waves!',
                                type: 'string',
                            },
                            { key: 'key', value: 123123123, type: 'integer' },
                            { key: 'key', value: true, type: 'boolean' },
                        ]);
                    }}
                >
                    Sign Data
                </button>
            </div>

            <div>
                <h2>Lease</h2>
                <button
                    onClick={() => {
                        signer
                            .lease({
                                amount: 677728840,
                                recipient:
                                    '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
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
                                amount: 677728840,
                                recipient: 'alias:T:merry',
                            })
                            .broadcast();
                    }}
                >
                    Lease to Merry by alias
                </button>
            </div>

            <div>
                <h2>Sponsorship</h2>
                <button
                    onClick={() => {
                        signer
                            .sponsorship({
                                assetId:
                                    '8BrF9fVo2tDPGMdcx91EdTZLmwUDX7K7h1zs6txCpAAA',
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
                                    '8BrF9fVo2tDPGMdcx91EdTZLmwUDX7K7h1zs6txCpAAA',
                                minSponsoredAssetFee: 0,
                            })
                            .broadcast();
                    }}
                >
                    Sign Sponsorship Disable
                </button>
            </div>

            <div>
                <h2>Cancel Lease</h2>
                <button
                    onClick={() => {
                        signer
                            .cancelLease({
                                leaseId:
                                    'FUQasynBUELMXc9T1hrphfFwJvU2ENBiUfnJPci7jq4w',
                            })
                            .broadcast();
                    }}
                >
                    Cancel Lease
                </button>
            </div>

            <div>
                <h2>Alias</h2>
                <button
                    onClick={() => {
                        signer.alias({ alias: 'new_alias' }).broadcast();
                    }}
                >
                    Sign Alias
                </button>
            </div>

            <div>
                <h2>Reissue</h2>
                <button
                    onClick={() => {
                        signer
                            .reissue({
                                assetId:
                                    '6RHh59Tbt17QPvgaEu79DQsC5XyTqhBzpfB2FLV59ABU',
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
                <h2>Account Script</h2>
                <button
                    onClick={() => {
                        signer
                            .setScript({
                                script:
                                    'AgQAAAAEdGhpcwkBAAAAB2V4dHJhY3QAAAABCAUAAAACdHgAAAAGc2VuZGVyBAAAAAckbWF0Y2gwBQAAAAJ0eAMJAAABAAAAAgUAAAAHJG1hdGNoMAIAAAATVHJhbnNmZXJUcmFuc2FjdGlvbgQAAAABdAUAAAAHJG1hdGNoMAQAAAANY29ycmVjdEFuc3dlcgkBAAAAB2V4dHJhY3QAAAABCQAEHAAAAAIFAAAABHRoaXMCAAAADWhhc2hlZCBhbnN3ZXIEAAAABmFuc3dlcgkAAfUAAAABCAUAAAABdAAAAAphdHRhY2htZW50AwkAAAAAAAACBQAAAA1jb3JyZWN0QW5zd2VyBQAAAAZhbnN3ZXIJAQAAAAEhAAAAAQkBAAAACWlzRGVmaW5lZAAAAAEIBQAAAAF0AAAAB2Fzc2V0SWQHAwMJAAABAAAAAgUAAAAHJG1hdGNoMAIAAAAPRGF0YVRyYW5zYWN0aW9uBgkAAAEAAAACBQAAAAckbWF0Y2gwAgAAABRTZXRTY3JpcHRUcmFuc2FjdGlvbgQAAAABcwUAAAAHJG1hdGNoMAkAAfQAAAADCAUAAAABcwAAAAlib2R5Qnl0ZXMJAAGRAAAAAggFAAAAAXMAAAAGcHJvb2ZzAAAAAAAAAAAACAUAAAABcwAAAA9zZW5kZXJQdWJsaWNLZXkHnYrj7g==',
                            })
                            .broadcast();
                    }}
                >
                    Set Script
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

            <div>
                <h1>Clear</h1>
                <button
                    onClick={() => {
                        localStorage.clear();
                    }}
                >
                    Clear storage
                </button>
            </div>
        </div>
    );
}

render(<TestApp />, document.getElementById('root'));
