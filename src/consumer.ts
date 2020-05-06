import { url } from 'inspector';

export interface IConsumer {
  send(): void;
  flush(): void;
  close(): void;
}

export interface IDebugOption {
  serverUrl: string;
}

export class DebugConsumer implements IConsumer {
  private option: IDebugOption;

  constructor(option: IDebugOption) {
    this.option = option;
  }

  send(): void {
    console.log('触发事件');
    console.log(this.option.serverUrl);
  }
  flush(): void {
    throw new Error('Method not implemented.');
  }
  close(): void {
    throw new Error('Method not implemented.');
  }
}
