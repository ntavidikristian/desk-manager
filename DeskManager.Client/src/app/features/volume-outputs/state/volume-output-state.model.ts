import { DeviceState } from '../enums/devices-state.enum';

export interface VolumeOutputStateModel {
  outputDeviceIds: string[];
  devices: Record<string, OutputDeviceState>;
  defaultDeviceId: string;
}

export interface OutputDeviceState {
  id: string;
  name: string;

  volume?: number;
  muted?: boolean;
  state: DeviceState;
}
