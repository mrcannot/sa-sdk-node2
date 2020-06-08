import { zlib } from 'mz'
import fetch from 'node-fetch'
import formUrlEncoded from 'form-urlencoded'
import { Logger, format, LoggerOptions, createLogger } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
export interface IConsumer {
  send(message: any): Promise<any>
  flush(): void
  close(): void
}

export class DebugOption {
  serverUrl!: string
}

export class DebugConsumer implements IConsumer {
  private option: DebugOption

  constructor(option: DebugOption) {
    this.option = option
  }

  async send(message: any): Promise<any> {
    const messages = Array.isArray(message) ? message : [message]
    let messageString = JSON.stringify(messages)
    console.log(messageString)
    messageString = (await zlib.gzip(Buffer.from(messageString, 'utf-8'))).toString('base64')
    console.log(messageString)

    const headers = {
      'User-Agent': 'SensorsAnalytics Node SDK',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Dry-Run': 'false'
    }
    const body = formUrlEncoded({
      data_list: messageString,
      gzip: 1
    })
    console.log(body)
    return new Promise((resolve, reject) => {
      fetch(this.option.serverUrl, {
        method: 'POST',
        headers,
        body,
        timeout: 3000
      })
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          console.log(err)
          reject(message)
        })
    })
  }
  flush(): void {
    throw new Error('Method not implemented.')
  }
  close(): void {
    throw new Error('Method not implemented.')
  }
}

export class LoggingConsumer implements IConsumer {
  private logger: Logger

  constructor(path: string) {
    if (path === null) {
      path = __dirname
    }
    const filePrefix = '/service.log.'
    const myFormat = format.printf(({ message }) => message)
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
    }
    this.logger = createLogger(saLogConfiguration)
  }

  send(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let messageString = JSON.stringify(message)
      console.log(messageString)
      try {
        this.logger.info(messageString)
        resolve('success')
      } catch (e) {
        console.error(e)
        reject(e)
      }
    })
  }
  flush(): void {
    throw new Error('Method not implemented.')
  }
  close(): void {
    throw new Error('Method not implemented.')
  }
}

export class NWConsumer implements IConsumer {
  send(message: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
  flush(): void {
    throw new Error('Method not implemented.')
  }
  close(): void {
    throw new Error('Method not implemented.')
  }
}
