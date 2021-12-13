import * as constantsModule from './src/constants';
import * as hooksModule from './src/hooks';
import * as utilsModule from './src/utils';

export * from './src/components';
export * from './src/pages';
export * from './src/interface';

export const hooks = { ...hooksModule };
export const CONSTANTS = { ...constantsModule };
export const utils = { ...utilsModule };
