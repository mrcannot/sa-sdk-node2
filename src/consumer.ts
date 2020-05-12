import { zlib } from 'mz';
import fetch from 'node-fetch';
import formUrlEncoded from 'form-urlencoded';
import { Logger, format, LoggerOptions, transports, createLogger } from 'winston';
import DailyRotateFile, { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
export interface IConsumer {
  send(message: any): void;
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

  async send(message: any): Promise<void> {
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

export class LoggingConsumer implements IConsumer {
  private logger: Logger;

  constructor(path: string) {
    const filePrefix = '/service.log.';
    const myFormat = format.printf(({ message }) => message);
    const saLogConfiguration: LoggerOptions = {
      transports: [
        new DailyRotateFile({
          filename: `${path + filePrefix}%DATE%`,
          datePattern: 'YYYYMMDD',
          format: myFormat,
          level: 'info',
          zippedArchive: false
        })
      ]
    };
    this.logger = createLogger(saLogConfiguration);
  }

  send(message: any): void {
    let messageString = JSON.stringify(message);
    console.log(messageString);
    try {
      this.logger.info(messageString);
    } catch (e) {
      console.error(e);
    }
  }
  flush(): void {
    throw new Error('Method not implemented.');
  }
  close(): void {
    throw new Error('Method not implemented.');
  }
}
