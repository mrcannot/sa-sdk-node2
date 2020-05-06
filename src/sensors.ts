import { IConsumer } from './consumer';

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

  public async track() {
    console.log('track');
    this.consumer.send();
  }
}
