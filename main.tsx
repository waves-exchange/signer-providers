import React from 'react';
import { render } from 'react-dom';
import { TestProviderWeb } from './TestProviderWeb';
import { TestProviderCloud } from './TestProviderCloud';
import { TestProviderMailbox } from './TestProviderMailbox';

type TProvider = 'web' | 'cloud' | 'mailbox';

function getInitialProvider(): TProvider {
    switch (true) {
        case location.href.includes('provider-cloud'):
            return 'cloud';
        case location.href.includes('provider-mailbox'):
            return 'mailbox';
        default:
            return 'web';
    }
}

const initialProvider = getInitialProvider();
function deleteFrames(): void {
    const frames = window.document.getElementsByTagName('iframe');
    for (let i = 0; i < frames.length; i++) {
        window.document.body.removeChild(frames[i]);
    }
}

function TestApp(): React.ReactElement {
    const [provider, setProvider] = React.useState<TProvider>(initialProvider);

    const setProviderWeb = React.useCallback((): void => {
        setProvider('web');
        deleteFrames();
    }, []);

    const setProviderCloud = React.useCallback((): void => {
        setProvider('cloud');
        deleteFrames();
    }, []);

    const setProviderMailbox = React.useCallback((): void => {
        setProvider('mailbox');
        deleteFrames();
    }, []);

    return (
        <>
            <div>
                <button
                    onClick={setProviderWeb}
                >
                    Provider Web
                </button>
                <button
                    onClick={setProviderCloud}
                >
                    Provider Cloud
                </button>
                <button
                    onClick={setProviderMailbox}
                >
                    Provider Mailbox
                </button>
            </div>
            {(() => {
                switch (provider) {
                    case 'cloud':
                        return <TestProviderCloud />;
                    case 'mailbox':
                        return <TestProviderMailbox />;
                    default:
                        return <TestProviderWeb />;
                }
            })()}
        </>
    );
}

render(<TestApp />, document.getElementById('root'));
