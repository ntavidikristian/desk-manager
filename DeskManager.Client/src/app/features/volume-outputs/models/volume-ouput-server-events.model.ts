import { InputDeviceSnapshot } from './input-device-snapshot.model';

export interface VolumeOutputServerEventsMap {
  // key          * payload type
  volumeChange: {
    volume: number;
    deviceId: string;
  };
  outputSnapshots: {
    defaultDeviceId: string;
    snapshots: InputDeviceSnapshot[];
  };
}

export type VolumeOutputServerEvent = keyof VolumeOutputServerEventsMap;
export type VolumeOutputServerEventPayload<Event extends VolumeOutputServerEvent> =
  Event extends VolumeOutputServerEvent ? VolumeOutputServerEventsMap[Event] : never;
