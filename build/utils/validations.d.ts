import type { ConfigOptions, PluginOptions } from './types';
import type { RouteOptions } from '../routes/types';
import type { HookOptions } from '../hooks/types';
declare const configSchema: any;
declare const routeSchema: any;
declare const pluginSchema: any;
declare const hookSchema: any;
declare function getDefaultConfig(): ConfigOptions;
declare function validateConfig(config?: {}): false | ConfigOptions;
declare function validateRoute(route: any, routeName: string): RouteOptions | false;
declare function validatePlugin(plugin: any): PluginOptions | false;
declare function validateHook(hook: any): HookOptions | false;
export { validateRoute, validatePlugin, validateHook, validateConfig, getDefaultConfig, configSchema, hookSchema, routeSchema, pluginSchema, };
