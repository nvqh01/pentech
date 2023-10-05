import anyAscii from 'any-ascii';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export function convertUrlObject(url: string, throwError?: boolean): URL {
  try {
    return new URL(url);
  } catch (error) {
    if (throwError) throw error;
    return null;
  }
}

export function convertUnicodeToAscii(text: string): string {
  if (!text) return getUuid();
  return anyAscii(text).replace(' -', '').split(' ').join('-');
}

export function getCurrentDate(): Date {
  return moment().toDate();
}

export function getUuid(): string {
  return uuidv4();
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export * from './hash-url';
