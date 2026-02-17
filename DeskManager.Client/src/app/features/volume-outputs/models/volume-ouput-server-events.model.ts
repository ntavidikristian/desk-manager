export interface VolumeOutputServerEventsMap {
  // key          * payload type
  volumeChange: {
    volume: number;
  };
}

export type VolumeOutputServerEvent = keyof VolumeOutputServerEventsMap;
export type VolumeOutputServerEventPayload<Event extends VolumeOutputServerEvent> =
  Event extends VolumeOutputServerEvent ? VolumeOutputServerEventsMap[Event] : never;
