import * as _ from 'lodash'

import { Lib, Track } from './properties'
import fs from 'fs'
import pathUtil from 'path'

const packageInfoText = fs.readFileSync(pathUtil.resolve(__dirname, '../package.json'), { encoding: 'utf8' })
const packageInfo = JSON.parse(packageInfoText)
const version = packageInfo.version

/**
 * 生成随机的 _track_id
 */
function trackId(): number {
  return parseInt((Math.random() * (9999999999 - 999999999 + 1) + 999999999).toString(), 10)
}

export function trackEvent(
  allowReNameOption: boolean,
  type: string,
  distinctId: string,
  isLoginId: boolean,
  eventName?: string,
  properties?: any,
  originDistinceId?: string
): any {
  const track = new Track()
  track._track_id = trackId()
  track.type = type
  if (eventName) {
    if (allowReNameOption) {
      eventName = pascal2Snake(eventName)
    }
    track.event = eventName
  }
  track.distinct_id = distinctId
  assertKey('Distinct Id', distinctId)
  assertProperties(type, properties)
  if (_.isEqual(type, 'track')) {
    assertKeyWithRegex('Event Name', eventName!)
  } else if (_.isEqual(type, 'track_signup')) {
    assertKey('Original Distinct Id', originDistinceId)
    track.originalId = originDistinceId
  }
  track.time = _.now()
  if (!_.isNull(properties) && _.has(properties, '$time')) {
    _.remove(properties, '$time')
    track.time = Date.parse(_.get(properties, '$time'))
  }
  if (!_.isNull(properties) && _.has(properties, '$project')) {
    _.remove(properties, '$project')
    track.project = _.get(properties, '$project')
  }
  const libObject = removeUndefined(getLibInfo())
  track.lib = libObject
  const publicProterties = {}
  if (allowReNameOption) {
    properties = translateKeys(properties)
  }
  if (_.startsWith(type, 'profile_')) {
    track.properties = assign(properties, { $is_login_id: isLoginId }, publicProterties)
  } else {
    track.properties = assign(getLibInfo(), properties, { $is_login_id: isLoginId }, publicProterties)
  }
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

export function assertProperties(eventType: string, properties: any) {
  if (properties === null) {
    return
  }
  _.each(properties, (val, key) => {
    if (_.isEqual(key, '$is_login_id')) {
      if (!(val instanceof Boolean)) {
        throw new Error("The property value of '$is_login_id' should be Boolean")
      }
    }
    assertKeyWithRegex('property', key)

    if (!_.isNumber(val) && !_.isDate(val) && !_.isString(val) && !_.isBoolean(val) && !_.isArray(val)) {
      throw new Error(`The property '${key}' should be a basic type: Number, String, Date, Boolean, List<String>.`)
    }

    if (key === '$time' && !_.isDate(val)) {
      throw new Error("The property '$time' should be a java.util.Date.")
    }

    if (_.isArray(val)) {
      _.each(val, (value, key) => {
        if (!_.isString(value)) {
          throw new Error(`The property ${key} should be a list of String.`)
        }
        if (_.size(value) > 8192) {
          value = value.substring(0, 8192)
        }
      })
    }
    if (_.isEqual(eventType, 'profile_increment')) {
      if (!_.isNumber(val)) {
        return new Error('The property value of PROFILE_INCREMENT should be a Number.')
      }
    } else if (_.isEqual(eventType, 'profile_append')) {
      if (!_.isArray(val)) {
        throw new Error('The property value of PROFILE_INCREMENT should be a List<String>.')
      }
    }
  })
}

const KEY_PATTERN = /^((?!^distinct_id$|^original_id$|^time$|^properties$|^id$|^first_id$|^second_id$|^users$|^events$|^event$|^user_id$|^date$|^datetime$)[a-zA-Z_$][a-zA-Z\d_$]{0,99})$/
/**
 * 检查属性是否合法
 * @param type 属性名
 * @param key 属性值
 */
export function assertKeyWithRegex(type: string, key: string) {
  assertKey(type, key)
  if (!KEY_PATTERN.exec(key)) {
    throw new Error(`${type} is invalid`)
  }
}

/**
 * 检查属性 key 是否合法
 * @param key 属性名
 * @param type 属性值
 */
export function assertKey(type: string, key = 'value') {
  if (typeof key !== 'string') {
    throw new Error(`${type} must be a string`)
  }
  if (key.length === 0) {
    throw new Error(`${type} is empty`)
  }
  if (key.length > 255) {
    throw new Error(`${type} is too long`)
  }
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

// const UPPER_CASE_LETTER = /([A-Z])/g
export function pascal2Snake(text: string): string {
  // const reg = new RegExp('^[A-Z_]+$')
  // if (text == null || text === '$SignUp' || reg.test(text)) {
  //   return text
  // }
  // return text.replace(UPPER_CASE_LETTER, (match, letter) => `_${letter.toLowerCase()}`)
  return _.snakeCase(text)
}

export function translateKeys(properties: object): any {
  return _cleanUpObjectKeys(properties)
}

function _cleanUpObjectKeys(data: any) {
  let resultObject: any = {}
  _.mapKeys(data, (value, key) => {
    const newKey = _.snakeCase(_.trim(key))
    console.log(newKey)
    resultObject[newKey] = value
  })
  return resultObject
}
