/* eslint-disable no-useless-escape */
import { createHash } from 'crypto';
import moment from 'moment';
import sanitizeHtml from 'sanitize-html';
import unidecode from 'unidecode';
import { v4 as uuidv4 } from 'uuid';

export function cleanHtml(html: string): string {
  const options: sanitizeHtml.IOptions = {
    allowedTags: [
      'address',
      'article',
      'aside',
      'footer',
      'header',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'hgroup',
      'main',
      'nav',
      'section',
      'blockquote',
      'dd',
      'div',
      'dl',
      'dt',
      'figcaption',
      'figure',
      'hr',
      'li',
      'main',
      'ol',
      'p',
      'pre',
      'ul',
      'a',
      'abbr',
      'b',
      'bdi',
      'bdo',
      'br',
      'cite',
      'code',
      'data',
      'dfn',
      'em',
      'i',
      'kbd',
      'mark',
      'q',
      'rb',
      'rp',
      'rt',
      'rtc',
      'ruby',
      's',
      'samp',
      'small',
      'span',
      'strong',
      'sub',
      'sup',
      'time',
      'u',
      'var',
      'wbr',
      'caption',
      'col',
      'colgroup',
      'table',
      'tbody',
      'td',
      'tfoot',
      'th',
      'thead',
      'tr',
    ],
    disallowedTagsMode: 'discard',
    allowedAttributes: {
      a: ['href', 'name', 'target'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
    },
    selfClosing: [
      'img',
      'br',
      'hr',
      'area',
      'base',
      'basefont',
      'input',
      'link',
      'meta',
    ],
    allowedSchemes: ['http', 'https'],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
    allowProtocolRelative: true,
    enforceHtmlBoundary: false,
    parseStyleAttributes: true,
  };

  return sanitizeHtml(html, options);
}

export function convertStringToDate(dateString: string) {
  let datePattern: string = '';

  if (/\d{0,2}:\d{0,2}\s\d{0,2}\/\d{0,2}\/\d{0,4}/g.test(dateString))
    datePattern = 'hh:mm DD/MM/YYYY';

  if (/\d{0,2}-\d{0,2}-\d{0,4}\s\d{0,2}:\d{0,2}:\d{0,2}/g.test(dateString))
    datePattern = 'YYYY-MM-DD hh:mm:ss';

  return moment(dateString, datePattern).toDate();
}

export function convertUrlObject(url: string, throwError?: boolean): URL {
  try {
    return new URL(url);
  } catch (error) {
    if (throwError) throw error;
    return null;
  }
}

export function convertUnicodeToAscii(input: string): string {
  return unidecode(input)
    .toLowerCase()
    .replaceAll(/[~!@#$%^&*()+-]/gi, '')
    .replaceAll(/\s{1,}/gi, ' ')
    .trim()
    .split(' ')
    .join('-');
}

export function getBaseHostFromUrl(url: string): string {
  const urlObject = convertUrlObject(url);
  if (!urlObject) return null;

  const host = urlObject.hostname;
  const regExp = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?=]+)/im;
  const match = host.match(regExp);

  return match && match.length ? match[1] : host;
}

export function getCurrentDate(): Date {
  return moment().toDate();
}

export function getUuid(): string {
  return uuidv4();
}

export function hashStringToUid(input: string): string {
  return createHash('md5').update(input).digest('hex');
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export * from './hash-url';
