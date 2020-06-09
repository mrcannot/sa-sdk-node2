import * as _ from 'lodash'
import { zlib } from 'mz'
import fetch from 'node-fetch'
import formUrlEncoded from 'form-urlencoded'
import { Logger, format, LoggerOptions, createLogger } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { DBCache } from './db'
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
        timeout: 10000
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
  flush(): void {}
  close(): void {}
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
      try {
        this.logger.info(messageString)
        resolve(messageString)
      } catch (e) {
        console.error(e)
        reject(e)
      }
    })
  }
  flush(): void {}
  close(): void {}
}

export class NWOption {
  serverUrl!: string
  cachePath?: string
}

export class NWConsumer implements IConsumer {
  private option: NWOption
  private db: DBCache

  constructor(option: NWOption) {
    this.option = option
    this.db = new DBCache(option.cachePath)
    new Promise<any>(() => {
      this.db.uploadCache((message) => {
        this.send(message)
      })
    })
  }

  async send(message: any): Promise<any> {
    this.db.cacheLog(JSON.stringify(message))
    const messages = Array.isArray(message) ? message : [message]
    let messageString = JSON.stringify(messages)
    messageString = (await zlib.gzip(Buffer.from(messageString, 'utf-8'))).toString('base64')

    const headers = {
      'User-Agent': 'SensorsAnalytics Node SDK',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Dry-Run': 'false'
    }
    const body = formUrlEncoded({
      data_list: messageString,
      gzip: 1
    })
    return new Promise((resolve, reject) => {
      fetch(this.option.serverUrl, {
        method: 'POST',
        headers,
        body,
        timeout: 10000
      })
        .then((response) => {
          if (response.status > 300) {
            this.db.cacheLog(JSON.stringify(message))
          }
          resolve(response)
        })
        .catch((err) => {
          console.log(err)
          this.db.cacheLog(JSON.stringify(message))
          reject(message)
        })
    })
  }
  flush(): void {}
  close(): void {}
}
