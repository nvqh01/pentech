export class ProxyManagerConfig {
  public proxies: string[];

  constructor(props: Partial<ProxyManagerConfig>) {
    Object.assign(this, {
      proxies: props?.proxies || [],
    });
  }
}
