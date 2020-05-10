import { IConsumer } from './consumer';
import { trackEvent } from './utils';

export class Sensors {
  private static instance: Sensors;

  private consumer: IConsumer;

  public static getInstance() {
    if (!Sensors.instance) {
      Sensors.instance = new Sensors();
    }
    return Sensors.instance;
  }

  public constructor() {
    console.log('init sensors');
  }

  public init(consumer: IConsumer) {
    this.consumer = consumer;
  }

  public async track(distinctId: string, isLoginId: boolean, eventName: string, properties?: any) {
    console.log('track');
    let event = trackEvent(distinctId, isLoginId, eventName, properties);
    this.consumer.send(event);
  }
}
