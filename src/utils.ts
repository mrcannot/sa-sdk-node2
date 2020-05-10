import path = require('path');
import * as _ from 'lodash';
import { TSMap } from 'typescript-map';

import { version } from '../package.json';

/**
 * 生成随机的 _track_id
 */
function trackId(): number {
  return parseInt((Math.random() * (9999999999 - 999999999 + 1) + 999999999).toString(), 10);
}

export function trackEvent(distinctId: string, isLoginId: boolean, eventName: string, properties?: any): TSMap<string, any> {
  assertKey('Distinct Id', distinctId);
  const data = new TSMap<string, any>();
  data.set('_track_id', trackId());
  data.set('type', 'track');
  data.set('event', eventName);
  data.set('time', _.now());
  data.set('distinct_id', distinctId);
  const p: TSMap<string, any> = new TSMap<string, object>();
  p.set('$lib', 'Node');
  p.set('$lib_version', version);
  p.set('$is_login_id', isLoginId);
  data.set('properties', p);
  data.set('lib', { $lib: 'Node', $lib_method: 'code', $lib_version: version, $lib_detail: 'O' });
  return data;
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
export function parseCallInfo(text: any) {
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
