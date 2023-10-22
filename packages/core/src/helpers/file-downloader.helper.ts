import axios, { AxiosProxyConfig, AxiosRequestConfig } from 'axios';
import { outputFileSync } from 'fs-extra';

interface CloudFlareStorage {
  type: 'cloud_flare_storage';
  bucket?: string;
  key: string;
}

interface DiskStorage {
  type: 'disk_storage';
  path: string;
}

type FileStorage = CloudFlareStorage | DiskStorage;

export interface FileDownloaderConfig {
  requestConfig: AxiosRequestConfig;
  storages: FileStorage[];
  proxy?: string;
}

export class FileDownloader {
  constructor(private config: FileDownloaderConfig) {}

  private buildProxyConfig(proxy: string): AxiosProxyConfig {
    const [host, port, username, password] = proxy.split(':');

    const proxyConfig: AxiosProxyConfig = {
      protocol: 'http',
      host,
      port: Number(port),
      auth: {
        username,
        password,
      },
    };

    return proxyConfig;
  }

  public async download(): Promise<{
    isDownloaded: boolean;
    errorMessage?: string;
  }> {
    try {
      const { requestConfig, storages, proxy } = this.config;
      proxy && (requestConfig.proxy = this.buildProxyConfig(proxy));

      const response = await axios.request({
        responseType: 'arraybuffer',
        timeout: 60_000,
        ...requestConfig,
      });

      if (response.status < 200 || response.status >= 300)
        return {
          isDownloaded: false,
          errorMessage: `Get status code ${response.status} while downloading image.`,
        };

      const binData = Buffer.from(response.data, 'binary');

      await Promise.all(
        storages.map(async storage => {
          storage.type === 'cloud_flare_storage' &&
            console.log('CloudFlare Storage');

          storage.type === 'disk_storage' &&
            outputFileSync(storage.path, binData, 'utf8');
        }),
      );

      return {
        isDownloaded: true,
      };
    } catch (error) {
      return {
        isDownloaded: false,
        errorMessage: error?.stack || 'Unknown',
      };
    }
  }
}
