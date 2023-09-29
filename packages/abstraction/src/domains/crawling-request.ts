import { RequestOptions } from 'crawlee';

export interface CrawlingRequest<Source> {
  source: Source;
  requestOptions: RequestOptions;
}
