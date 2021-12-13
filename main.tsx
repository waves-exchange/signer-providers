import React from 'react';
import { render } from 'react-dom';
import { TestProviderWeb } from './TestProviderWeb';
import { TestProviderCloud } from './TestProviderCloud';

type TProvider = 'web' | 'cloud';

const initialProvider = location.href.includes('provider-cloud') ? 'cloud' : 'web';
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
            </div>
            {provider === 'web' ?
                <TestProviderWeb /> :
                <TestProviderCloud />
            }
        </>
    );
}

render(<TestApp />, document.getElementById('root'));
