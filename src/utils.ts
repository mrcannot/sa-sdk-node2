import path = require('path');
import * as _ from 'lodash';

import { version } from '../package.json';
import { Lib, Track } from './properties';

/**
 * 生成随机的 _track_id
 */
function trackId(): number {
  return parseInt((Math.random() * (9999999999 - 999999999 + 1) + 999999999).toString(), 10);
}

export function trackEvent(distinctId: string, isLoginId: boolean, eventName: string, properties?: any): any {
  assertKey('Distinct Id', distinctId);
  const track = new Track();
  track._track_id = trackId();
  track.type = 'track';
  track.event = eventName;
  track.distinct_id = distinctId;
  track.time = _.now();
  const lib = new Lib();
  lib.$lib = 'Node';
  lib.$lib_method = 'code';
  lib.$lib_version = version;
  lib.$lib_detail = 'lib_detail';
  const libObject = removeUndefined(lib);
  track.lib = libObject;
  const p = {
    $is_login_id: isLoginId
  };
  const publicProterties = {};
  track.properties = assign(lib, p, properties, publicProterties);
  return removeUndefined(track);
}

function assertKey(type: string, key: string) {
  if (key === null || key === '' || key.length < 1 || key === undefined) {
    throw new Error(`The ${type} is empty.`);
  }
  if (key.length > 255) {
    throw new Error(`The ${type} is too long, max length is 255.`);
  }
}

function getLibDetail(callerIndex: number): string {
  const callerInfo = new Error();
  const stack = callerInfo.stack.split('\n', callerIndex + 1);
  const caller = parseCallInfo(stack);
  return stack.toString();
  if (callerInfo != null) {
    const caller = parseCallInfo(stack);
    return `${caller.className}##${caller.functionName}##${caller.fileName}##${caller.lineNumber},${caller.columnNumber}`;
  } else {
    return 'error';
  }
}

const CALL_INFO_REGEX = /^\s*at ((((\w+)\.)?(\w+|<anonymous>) \(((.+):(\d+):(\d+)|(native))\))|(.+):(\d+):(\d+))$/;
export function parseCallInfo(text: any): any {
  const matches = CALL_INFO_REGEX.exec(text);
  console.log(matches);
  if (matches == null) {
    return null;
  }

  return {
    fileName: matches[7] || matches[10] || matches[11],
    lineNumber: matches[8] || matches[12],
    columnNumber: matches[9] || matches[13],
    className: matches[4],
    functionName: matches[5]
  };
}

function getCallerFileNameAndLine() {
  function getException() {
    try {
      throw Error('');
    } catch (err) {
      return err;
    }
  }

  const err = getException();

  const stack = err.stack;
  const stackArr = stack.split('\n');
  let callerLogIndex = 0;
  for (let i = 0; i < stackArr.length; i++) {
    if (stackArr[i].indexOf('Map.Logger') > 0 && i + 1 < stackArr.length) {
      callerLogIndex = i + 1;
      break;
    }
  }

  if (callerLogIndex !== 0) {
    const callerStackLine = stackArr[callerLogIndex];
    return `[${callerStackLine.substring(callerStackLine.lastIndexOf(path.sep) + 1, callerStackLine.lastIndexOf(':'))}]`;
  } else {
    return '[-]';
  }
}

export function removeUndefined(obj: any): any {
  return _.pickBy(obj, (v) => !_.isUndefined(v));
}

export function assign(object: any, ...otherArgs: any[]): any {
  return _.assign(object, ...otherArgs);
}
