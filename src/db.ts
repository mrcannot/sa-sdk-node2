import { Database } from 'sqlite3'
import * as _ from 'lodash'

export class DBCache {
  private db: Database

  constructor(cachePahe?: string) {
    this.db = new Database(cachePahe + '/.sa/log/salog.db', (err) => {
      if (err) {
        console.log(err)
      }
      this.db.run(`CREATE TABLE IF NOT EXISTS salog(id INTEGER PRIMARY KEY AUTOINCREMENT,log TEXT)`, (err) => {
        if (err) {
          console.log(err)
        }
      })
    })
  }

  public cacheLog(message: string) {
    this.db.run('INSERT INTO salog(log) VALUES(?)', [message], function (err) {
      if (err) {
        return console.log('insert data error: ', err.message)
      }
    })
  }

  public selectAll(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db.all('SELECT * FROM salog', [], function (err, rows) {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
    })
  }

  public deleteById(id: number): any {
    this.db.run(`DELETE FROM salog WHERE id = ?`, [id], (err) => {
      if (err) {
        console.log(err)
      }
    })
  }

  public uploadCache(upload: (message: object) => void) {
    this.selectAll().then((rows) => {
      _.forEach(rows, (id, log) => {
        const message = JSON.parse(id.log)
        if (message._track_id) {
          // console.log(message._track_id)
          upload(message)
        }
        this.deleteById(id.id)
      })
    })
  }
}
