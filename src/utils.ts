import * as _ from 'lodash'

// import { version } from '../package.json'
import { Lib, Track } from './properties'
import fs from 'fs'
import pathUtil from 'path'

const packageInfoText = fs.readFileSync(pathUtil.resolve(__dirname, '../package.json'), { encoding: 'utf8' })
const version = JSON.parse(packageInfoText).version
// const version = packageInfo

/**
 * 生成随机的 _track_id
 */
function trackId(): number {
  return parseInt((Math.random() * (9999999999 - 999999999 + 1) + 999999999).toString(), 10)
}

export function trackEvent(type: string, distinctId: string, isLoginId: boolean, eventName?: string, properties?: any): any {
  assertKey('Distinct Id', distinctId)
  const track = new Track()
  track._track_id = trackId()
  track.type = type
  if (eventName) {
    track.event = eventName
  }
  track.distinct_id = distinctId
  track.time = _.now()
  const libObject = removeUndefined(getLibInfo())
  track.lib = libObject
  const p = {
    $is_login_id: isLoginId
  }
  const publicProterties = {}
  track.properties = assign(getLibInfo(), p, properties, publicProterties)
  return removeUndefined(track)
}

function getLibInfo(): Lib {
  const lib = new Lib()
  lib.$lib = 'Node'
  lib.$lib_method = 'code'
  lib.$lib_version = version
  lib.$lib_detail = getLibDetail()
  return lib
}

function assertKey(type: string, key: string) {
  if (key === null || key === '' || key.length < 1 || key === undefined) {
    throw new Error(`The ${type} is empty.`)
  }
  if (key.length > 255) {
    throw new Error(`The ${type} is too long, max length is 255.`)
  }
}

/**
 * 获取被调用堆栈
 */
export function getLibDetail(): any {
  const myObject = Object.create(null)
  Error.captureStackTrace(myObject)
  const stack = myObject.stack.split('\n')
  let realStack = ''
  stack.every((val: string, _idx: any, _array: any) => {
    if (val.indexOf('<anonymous>') != -1) {
      realStack = val
      return false
    }
    return true // Continues
  })
  const CALL_INFO_REGEX = /^\s*at ((((\w+)\.)?(\w+|<anonymous>) \(((.+):(\d+):(\d+)|(native))\))|(.+):(\d+):(\d+))$/
  const matches = CALL_INFO_REGEX.exec(realStack)

  if (matches == null) {
    return null
  }
  return `${matches[4]}##${matches[5]}##${matches[7] || matches[10] || matches[11]}##${matches[8] || matches[12]},${
    matches[9] || matches[13]
  }`
}

/**
 * 去除重复的对象
 * @param obj 被操作的对象
 */
export function removeUndefined(obj: any): any {
  return _.pickBy(obj, (v) => !_.isUndefined(v))
}

/**
 * 合并对象
 * @param object 被合并的对象
 * @param otherArgs 被合并的对象
 */
export function assign(object: any, ...otherArgs: any[]): any {
  return _.assign(object, ...otherArgs)
}
