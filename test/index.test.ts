import { Sensors, LoggingConsumer } from '../src/index'

Sensors.getInstance().init(new LoggingConsumer(__dirname))
Sensors.getInstance().superizeProperties({
  qqq: '222'
})
for (let i = 0; i < 10; i++) {
  Sensors.getInstance()
    .track('111', true, 'aaa', { aaa: 'bbb' })
    .then((response) => {
      console.log(response)
    })
    .catch((err) => {
      console.log(err)
    })
  Sensors.getInstance().profileSet('111', true, { aaa: 'vvv' })
  Sensors.getInstance().profileSet('111', true, { aaa: 'bbb' })
}
