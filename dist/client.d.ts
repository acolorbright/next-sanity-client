import type { ClientConfig, ClientFetchParams, FetchConfig, Union } from './types';
export declare class SanityClient<Q extends Record<string, string> = Record<string, string>> {
    private config;
    constructor(config: ClientConfig<Q>);
    fetch<T = unknown, P = Record<string, unknown>>({ query, params, config, perspective }: ClientFetchParams<P>): Promise<T>;
    createApiUtil<T = unknown, P extends Record<string, unknown> = Record<string, unknown> | never>(query: Union<keyof Q>, config?: FetchConfig): (params?: P & FetchConfig) => Promise<T>;
}
