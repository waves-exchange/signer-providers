import React, { FC } from 'react';
import { Global, css } from '@emotion/core';

export const GlobalCSS: FC = () => {
    return (
        <Global
            styles={css`
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 300;
                    font-display: swap;
                    src: url(/fonts/roboto-light7.woff2) format('woff2');
                }
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                    src: url('/fonts/roboto7.woff2') format('woff2');
                }
                @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 700;
                    font-display: swap;
                    src: url('/fonts/roboto-medium7.woff2') format('woff2');
                }
                html {
                    height: 100%;
                }
                body {
                    font-family: 'Roboto', sans-serif;
                    margin: 0;
                    padding: 0;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    -webkit-overflow-scrolling: touch;
                }
                @supports (-webkit-touch-callout: none) {
                    body {
                        min-height: -webkit-fill-available;
                    }
                }
                button {
                    font-family: 'Roboto', sans-serif;
                }
                #root {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 520px;
                    min-height: 100%;
                }
                #overlay {
                    position: fixed;
                    z-index: -1;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    overflow: hidden;
                    background-color: #000;
                    opacity: 0.6;
                }
                * {
                    box-sizing: border-box;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: #495060;
                    border-radius: 4px;
                }
                ::-webkit-scrollbar {
                    width: 3px;
                    height: 3px;
                }
                ::-webkit-scrollbar-corner {
                    opacity: 0;
                }
                ::-webkit-scrollbar-track-piece {
                    margin-bottom: 5px;
                    margin-top: 5px;
                }
                ::placeholder {
                    color: #959dae;
                }
            `}
        />
    );
};
