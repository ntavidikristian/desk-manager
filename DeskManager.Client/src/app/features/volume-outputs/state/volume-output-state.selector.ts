import { createSelector, Selector } from '@ngxs/store';
import { VolumeOutputState } from './volume-output.state';
import { OutputDeviceState, VolumeOutputStateModel } from './volume-output-state.model';

export class VolumeOutputStateSelectors {
  @Selector([VolumeOutputState])
  public static SelectDevices(state: VolumeOutputStateModel) {
    return state.devices;
  }

  @Selector([VolumeOutputState])
  public static SelectOutputDevices(state: VolumeOutputStateModel) {
    return Object.values(state.devices);
  }

  @Selector([VolumeOutputState])
  public static SelectDefaultDevice(state: VolumeOutputStateModel) {
    return state.defaultDeviceId;
  }

  public static selectDeviceState(deviceId: string) {
    return createSelector(
      [VolumeOutputStateSelectors.SelectDevices],
      (devices: Record<string, OutputDeviceState>) => devices[deviceId],
    );
  }
}
