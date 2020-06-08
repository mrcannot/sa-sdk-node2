// import { Sensors } from './../src/sensors'
import { Sensors, LoggingConsumer, DebugOption, DebugConsumer } from '../src/index'
//import { Lib, Track } from '../src/properties'
import { checkPattern } from '../src/utils'
//import path from 'path'
const debugOption: DebugOption = {
  serverUrl: 'https://newsdktest.datasink.sensorsdata.cn/debug?project=weiyi&token=5a394d2405c147ca'
}

Sensors.getInstance().init(new DebugConsumer(debugOption))
// Sensors.getInstance().init(new LoggingConsumer(__dirname))
// const p = path.dirname(require.main.filename)
// console.log(p)
for (let i = 0; i < 10; i++) {
  Sensors.getInstance()
    .track('111', true, 'aaa', { distinct_id: 'bbb' })
    .then((response) => {
      // console.log(response)
    })
    .catch((err) => {
      console.log(err)
    })
  Sensors.getInstance().profileSet('111', true, { aaa: 'vvv' })
  // Sensors.getInstance().profileSet('111', true, { aaa: 'bbb' })
}

// checkPattern('distinctId', 'distinct_id')
