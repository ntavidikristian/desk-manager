import { inject, Injectable } from '@angular/core';
import { WebsocketService } from '@app/shared/services/websocket-service';
import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { SetVolumeDto } from '../models/set-volume.dto';
import { OutputDeviceState, VolumeOutputStateModel } from './volume-output-state.model';
import { VolumeOutputActions } from './volume-output.actions';

@State<VolumeOutputStateModel>({
  name: 'volume_outputs',
  defaults: {
    devices: {},
    outputDeviceIds: [],
    defaultDeviceId: '',
  },
})
@Injectable()
export class VolumeOutputState {
  private readonly websocketService = inject(WebsocketService);

  constructor() {}

  @Action(VolumeOutputActions.ClientSetVolume)
  public setVolume(
    _ctx: StateContext<VolumeOutputStateModel>,
    { volume }: VolumeOutputActions.ClientSetVolume,
  ) {
    this.websocketService.sendItem('setVolume', { volume } satisfies SetVolumeDto);
  }

  // * server events
  @Action(VolumeOutputActions.ServerSetVolume)
  public setServerVolume(
    _ctx: StateContext<VolumeOutputStateModel>,
    { volume, deviceId }: VolumeOutputActions.ServerSetVolume,
  ) {
    _ctx.setState(
      patch({
        devices: patch({
          [deviceId]: patch({
            volume,
          }),
        }),
      }),
    );
  }

  @Action(VolumeOutputActions.ServerAudioOutputSnapshots)
  public setServerOutputs(
    _ctx: StateContext<VolumeOutputStateModel>,
    { snapshots, defaultDeviceId }: VolumeOutputActions.ServerAudioOutputSnapshots,
  ) {
    const deviceIds = snapshots.map((x) => x.id);
    const devices: OutputDeviceState[] = snapshots.map(
      (x) =>
        ({
          id: x.id,
          name: x.name,
          state: x.state,
          muted: x.muted,
          volume: x.volume,
        }) satisfies OutputDeviceState,
    );
    _ctx.setState(
      patch({
        defaultDeviceId,
        outputDeviceIds: deviceIds,
        devices: devices.reduce((aggr, current) => ({ ...aggr, [current.id]: current }), {}),
      }),
    );
  }
}
