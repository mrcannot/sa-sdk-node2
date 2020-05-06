import Sensors from '../src';
import { DebugConsumer, IDebugOption } from '../src/consumer';
const debugOption: IDebugOption = {
  serverUrl: '数据接收地址'
};
Sensors.getInstance().init(new DebugConsumer(debugOption));
Sensors.getInstance().track();
