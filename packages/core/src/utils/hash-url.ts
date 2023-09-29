import url_lib from 'url';
import { v5 as uuidv5 } from 'uuid';

export function hashUrl(url: string): string {
  if (!url) return null;
  url = normalizeUrl(url);
  return uuidv5(url, uuidv5.URL);
}

export function normalizeUrl(url: string, absolute?: boolean): string {
  const urlWithParsedQuery = url_lib.parse(url, true);
  const list = {};
  const keys = Object.keys(urlWithParsedQuery.query).sort();

  for (let i = 0; i < keys.length; i++) {
    list[keys[i]] = urlWithParsedQuery.query[keys[i]];
  }

  Object.keys(list).length && (urlWithParsedQuery.query = list);
  urlWithParsedQuery.pathname === '/' && (urlWithParsedQuery.pathname = '');

  delete urlWithParsedQuery.search;

  return absolute
    ? url_lib.format(urlWithParsedQuery)
    : url_lib
        .format(urlWithParsedQuery)
        .replace('http://', '')
        .replace('https://', '')
        .replace('www.', '');
}
