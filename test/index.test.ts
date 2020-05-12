import Sensors from '../src/index';
import { DebugConsumer, IDebugOption, LoggingConsumer } from '../src/consumer';
import { Lib, Track } from '../src/properties';
import { removeUndefined, assign } from '../src/utils';
const debugOption: IDebugOption = {
  serverUrl: 'https://newsdktest.datasink.sensorsdata.cn/debug?project=weiyi&token=5a394d2405c147ca'
};

// Sensors.getInstance().init(new DebugConsumer(debugOption));
Sensors.getInstance().init(new LoggingConsumer(__dirname));
for (let i = 0; i < 10; i++) {
  Sensors.getInstance().track('111', true, 'aaa', { aaa: 'bbb' });
}

// const callerInfo = new Error();
// const stack = callerInfo.stack.split('\n', 4 + 1);
// const caller = parseCallInfo(stack);
// console.log(caller);

// const CALL_INFO_REGEX = /^\s*at ((((\w+)\.)?(\w+|<anonymous>) \(((.+):(\d+):(\d+)|(native))\))|(.+):(\d+):(\d+))$/;
// export function parseCallInfo(text: any): any {
//   const matches = CALL_INFO_REGEX.exec(text);
//   console.log(matches);
//   if (matches == null) {
//     return null;
//   }

//   return {
//     fileName: matches[7] || matches[10] || matches[11],
//     lineNumber: matches[8] || matches[12],
//     columnNumber: matches[9] || matches[13],
//     className: matches[4],
//     functionName: matches[5]
//   };
// }
