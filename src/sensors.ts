import { IConsumer } from './consumer'
import { trackEvent } from './utils'
import { assertKeyWithRegex } from './utils'
import * as _ from 'lodash'

export class Sensors {
  private static instance: Sensors

  private consumer!: IConsumer

  private superProperties = {}

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

  public registerSuperProperties(superProperties = {}) {
    _.each(superProperties, (val, key) => {
      assertKeyWithRegex(val, key)
    })
    _.assign(this.superProperties, superProperties)
  }

  public track(distinctId: string, isLoginId: boolean, eventName: string, properties?: any): Promise<any> {
    let event = trackEvent('track', distinctId, isLoginId, eventName, _.assign(this.superProperties, properties))
    return this.consumer.send(event)
  }

  public trackSignUp(distinctId: string, originalId: string, properties?: any) {
    let event = trackEvent('track_signup', distinctId, true, '$SignUp', _.assign(this.superProperties, properties), originalId)
    return this.consumer.send(event)
  }

  public profileSet(distinctId: string, isLoginId: boolean, properties?: any): Promise<any> {
    let profile = trackEvent('profile_set', distinctId, isLoginId, undefined, properties)
    return this.consumer.send(profile)
  }

  public profileSetOnce(distinctId: string, isLoginId: boolean, properties?: any): Promise<any> {
    let profile = trackEvent('profile_set_once', distinctId, isLoginId, undefined, properties)
    return this.consumer.send(profile)
  }

  public profileIncrement(distinctId: string, isLoginId: boolean, properties?: any): Promise<any> {
    let profile = trackEvent('profile_increment', distinctId, isLoginId, undefined, properties)
    return this.consumer.send(profile)
  }

  public profileAppend(distinctId: string, isLoginId: boolean, properties?: any): Promise<any> {
    let profile = trackEvent('profile_append', distinctId, isLoginId, undefined, properties)
    return this.consumer.send(profile)
  }

  public profileUnset(distinctId: string, isLoginId: boolean, properties?: any): Promise<any> {
    let profile = trackEvent('profile_unset', distinctId, isLoginId, undefined, properties)
    return this.consumer.send(profile)
  }

  public profileDelete(distinctId: string, isLoginId: boolean, properties?: any): Promise<any> {
    let profile = trackEvent('profile_delete', distinctId, isLoginId, undefined, properties)
    return this.consumer.send(profile)
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
