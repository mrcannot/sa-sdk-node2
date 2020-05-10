import { TSMap } from 'typescript-map';
import { zlib } from 'mz';
import fetch from 'node-fetch';
import formUrlEncoded from 'form-urlencoded';

export interface IConsumer {
  send(message: TSMap<string, object>): void;
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

  async send(message: TSMap<string, object>): Promise<void> {
    console.log('触发事件');
    console.log(this.option.serverUrl);
    const messages = Array.isArray(message) ? message : [message];
    let messageString = JSON.stringify(messages);
    console.log(messageString);
    messageString = (await zlib.gzip(Buffer.from(messageString, 'utf-8'))).toString('base64');
    console.log(messageString);

    const headers = {
      'User-Agent': 'SensorsAnalytics Node SDK',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Dry-Run': 'false'
    };
    const body = formUrlEncoded({
      data_list: messageString,
      gzip: 1
    });
    console.log(body);
    const response = await fetch(this.option.serverUrl, {
      method: 'POST',
      headers,
      body,
      timeout: 3000
    });
    console.log(response.status);
  }
  flush(): void {
    throw new Error('Method not implemented.');
  }
  close(): void {
    throw new Error('Method not implemented.');
  }
}
