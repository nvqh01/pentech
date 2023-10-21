import { getUuid } from '@pentech/core';
import { Request, RequestOptions as BaseRequestOptions } from 'crawlee';

interface RequestOptions extends BaseRequestOptions {
  autoCreateUniqueKey?: boolean;
}

export function createRequests(
  options: RequestOptions | RequestOptions[],
): Request[] {
  !Array.isArray(options) && (options = [options]);

  options = options.map(({ autoCreateUniqueKey, ..._options }) => {
    autoCreateUniqueKey && (_options.uniqueKey = getUuid());
    return _options;
  });

  return options.map<Request>(_options => new Request({ ..._options }));
}

export function formatProxies(proxies: string[], shuffle?: boolean): string[] {
  proxies = proxies.map(proxy => {
    const [hostname, port, username, password] = proxy.split(':');
    return `http://${username}:${password}@${hostname}:${port}`;
  });
  return shuffle ? shuffleArray<string>(proxies) : proxies;
}

export function shuffleArray<T = any>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}
