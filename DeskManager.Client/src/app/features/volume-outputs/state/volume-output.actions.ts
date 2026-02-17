export namespace VolumeOutputActions {
  export class ClientSetVolume {
    static type  = '[VolumeOutputActions] ClientSetVolume'
    constructor(public volume: number) {}
  }

  // * events sent from server
  export class ServerSetVolume {
    static type  = '[VolumeOutputActions] ServerSetVolume'
    constructor(public volume: number) {}
  }
}
