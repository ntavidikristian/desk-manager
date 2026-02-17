export interface VolumeOutputStateModel {
  outputDeviceIds: string[];
  devices: Record<string, OutputDeviceState>;
}

interface OutputDeviceState {
  volume: number;
  muted: boolean;
  id: string;
  name: string;
}
