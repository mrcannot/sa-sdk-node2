const {
  Sensors,
  LoggingConsumer
} = require("../dist/index")

Sensors.getInstance().init(new LoggingConsumer(__dirname))
Sensors.getInstance().registerSuperProperties({
  "qqq": "222"
})
Sensors.getInstance().trackSignUp("111", "222")
for (let i = 0; i < 10; i++) {
  Sensors.getInstance().track('111', true, 'aaa', {
    aaa: 'bbb' + i
  }).then((response) => {
    console.log(response)
  })
}