import { DeviceState } from '../enums/devices-state.enum';

export interface InputDeviceSnapshot {
  id: string;
  name: string;
  state: DeviceState;
  volume?: number;
  muted?: boolean;
}
