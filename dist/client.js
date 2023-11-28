var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { getQueryString } from './utils';
const API_HOST = 'api.sanity.io';
const CDN_HOST = 'apicdn.sanity.io';
export class SanityClient {
    constructor(config) {
        this.config = config;
    }
    async fetch({ query, params, config, perspective = "raw" }) {
        var _a;
        const qs = getQueryString(query, perspective, params);
        const usePost = qs.length > 11264;
        const version = this.config.apiVersion
            ? `v${this.config.apiVersion.replace(/^v/, '')}`
            : 'v1';
        const host = this.config.useCdn ? CDN_HOST : API_HOST;
        const headers = new Headers();
        if (this.config.token)
            headers.set('Authorization', `Bearer ${this.config.token}`);
        if (usePost)
            headers.set('Content-Type', 'application/json');
        const url = `https://${this.config.projectId}.${host}/${version}/data/query/${this.config.dataset}`;
        const res = await fetch(`${url}${usePost ? `?perspective=${encodeURIComponent(perspective)}` : qs}`, Object.assign({ method: usePost ? 'POST' : 'GET', body: usePost ? JSON.stringify({ query, params: params }) : undefined, headers }, config));
        if (res.ok) {
            const data = await res.json();
            return data.result;
        }
        if ((_a = res.headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.includes('application/json')) {
            const error = await res.json();
            throw new Error(error.message);
        }
        throw new Error(`Error fetching data: ${res.statusText}`);
    }
    createApiUtil(query, config) {
        const { queries } = this.config;
        const groqQuery = queries && queries[query] ? queries[query] : query;
        return async (params) => {
            const _a = params || {}, { cache, next } = _a, rest = __rest(_a, ["cache", "next"]);
            return this.fetch({
                query: groqQuery,
                params: Object.keys(rest).length > 0 ? rest : undefined,
                config: { cache: cache !== null && cache !== void 0 ? cache : config === null || config === void 0 ? void 0 : config.cache, next: next !== null && next !== void 0 ? next : config === null || config === void 0 ? void 0 : config.next }
            });
        };
    }
}
