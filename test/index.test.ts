import Sensors from '../src/index';
import { DebugConsumer, IDebugOption } from '../src/consumer';
import { Lib, Track } from '../src/properties';
import { removeUndefined, assign } from '../src/utils';
const debugOption: IDebugOption = {
  serverUrl: ''
};

Sensors.getInstance().init(new DebugConsumer(debugOption));

// for (let i = 0; i < 10; i++) {
Sensors.getInstance().track('111', true, 'aaa', { aaa: 'bbb' });
// }
