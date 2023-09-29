import { Injectable, Scope } from '@pentech/core';
import { Producer } from './internal';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class ProducerService<Output = any> extends Producer<Output> {
  constructor() {
    super(ProducerService.name, 'producerService');
  }

  public setConfigKey(configKey: string): void {
    this.configKey = configKey;
  }
}
