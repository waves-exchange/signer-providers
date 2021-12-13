import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from '@waves.exchange/react-uikit';
import { GlobalCSS } from '@waves.exchange/provider-ui-components';

export default function (Some: React.ReactElement): void {
    render(
        <ThemeProvider theme={defaultTheme}>
            <GlobalCSS />
            {Some}
        </ThemeProvider>,
        document.getElementById('root')
    );
}
