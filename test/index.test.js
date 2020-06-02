const {
  Sensors,
  LoggingConsumer
} = require("../dist/index")

Sensors.getInstance().init(new LoggingConsumer(__dirname))
for (let i = 0; i < 10; i++) {
  Sensors.getInstance().track('111', true, 'aaa', {
    aaa: 'bbb' + i
  })
}