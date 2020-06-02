import { IConsumer } from './consumer'
import { trackEvent } from './utils'

export class Sensors {
  private static instance: Sensors

  private consumer!: IConsumer

  public static getInstance() {
    if (!Sensors.instance) {
      Sensors.instance = new Sensors()
    }
    return Sensors.instance
  }

  public constructor() {
    console.log('init sensors')
  }

  public init(consumer: IConsumer) {
    this.consumer = consumer
  }

  public track(distinctId: string, isLoginId: boolean, eventName: string, properties?: any) {
    let event = trackEvent('tract', distinctId, isLoginId, eventName, properties)
    this.consumer.send(event)
  }

  public trackSignUp() {}

  public profileSet(distinctId: string, isLoginId: boolean, properties?: any) {
    let profile = trackEvent('profile_set', distinctId, isLoginId, undefined, properties)
    this.consumer.send(profile)
  }

  public profileSetOnce(distinctId: string, isLoginId: boolean, properties?: any) {
    let profile = trackEvent('profile_set', distinctId, isLoginId, undefined, properties)
    this.consumer.send(profile)
  }

  public profileIncrement(distinctId: string, isLoginId: boolean, properties?: any) {
    let profile = trackEvent('profile_set', distinctId, isLoginId, undefined, properties)
    this.consumer.send(profile)
  }

  public profileAppend(distinctId: string, isLoginId: boolean, properties?: any) {
    let profile = trackEvent('profile_set', distinctId, isLoginId, undefined, properties)
    this.consumer.send(profile)
  }

  public profileUnset(distinctId: string, isLoginId: boolean, properties?: any) {
    let profile = trackEvent('profile_set', distinctId, isLoginId, undefined, properties)
    this.consumer.send(profile)
  }

  public profileDelete(distinctId: string, isLoginId: boolean, properties?: any) {
    let profile = trackEvent('profile_set', distinctId, isLoginId, undefined, properties)
    this.consumer.send(profile)
  }

  public itemSet() {}

  public itemDelete() {}

  public flush(): void {
    this.consumer.flush()
  }

  public shutdown(): void {
    this.consumer.close()
  }
}
