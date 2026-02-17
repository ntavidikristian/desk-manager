export interface VolumeOutputStateModel {
  outputDeviceIds: string[];
  devices: Record<string, OutputDeviceState>;
}

export interface OutputDeviceState {
  volume: number;
  muted: boolean;
  id: string;
  name: string;
}
