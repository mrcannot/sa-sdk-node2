// import { Sensors } from './../src/sensors'
import { Sensors, LoggingConsumer } from '../src/index'
//import { Lib, Track } from '../src/properties'
//import { removeUndefined, assign, getLibDetail } from '../src/utils'
//import path from 'path'
// const debugOption: DebugOption = {
//   serverUrl: 'https://newsdktest.datasink.sensorsdata.cn/debug?project=weiyi&token=5a394d2405c147ca'
// }

// Sensors.getInstance().init(new DebugConsumer(debugOption))
Sensors.getInstance().init(new LoggingConsumer(__dirname))
// const p = path.dirname(require.main.filename)
// console.log(p)
for (let i = 0; i < 10; i++) {
  Sensors.getInstance().track('111', true, 'aaa', { aaa: 'bbb' })
  // Sensors.getInstance().profileSet('111', true, { aaa: 'bbb' })
}
