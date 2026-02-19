import { InputDeviceSnapshot } from '../models/input-device-snapshot.model';

export namespace VolumeOutputActions {
  export class ClientSetVolume {
    static type = '[VolumeOutputActions] ClientSetVolume';
    constructor(public volume: number) {}
  }

  // * events sent from server
  export class ServerSetVolume {
    static type = '[VolumeOutputActions] ServerSetVolume';
    constructor(
      public volume: number,
      public deviceId: string,
    ) {}
  }

  export class ServerAudioOutputSnapshots {
    static type = '[VolumeOutputActions] AudioOutputSnapshots';
    constructor(
      public snapshots: InputDeviceSnapshot[],
      public defaultDeviceId: string,
    ) {}
  }
}
