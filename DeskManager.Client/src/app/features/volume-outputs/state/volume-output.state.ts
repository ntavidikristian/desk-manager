import { inject, Injectable } from '@angular/core';
import { WebsocketService } from '@app/shared/services/websocket-service';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { SetVolumeDto } from '../models/set-volume.dto';
import { VolumeOutputStateModel } from './volume-output-state.model';
import { VolumeOutputActions } from './volume-output.actions';
import { VolumeOutputServerEventsMap } from '../models/volume-ouput-server-events.model';
import { patch } from '@ngxs/store/operators';

@State<VolumeOutputStateModel>({
  name: 'volume_outputs',
  defaults: {
    devices: {},
    outputDeviceIds: [],
  },
})
@Injectable()
export class VolumeOutputState {
  private readonly websocketService = inject(WebsocketService);
  private readonly store = inject(Store);

  constructor() {
    setTimeout(() => {
      this.websocketService.registerEventHandler<VolumeOutputServerEventsMap, 'volumeChange'>(
        'volumeChange',
        (payload) => {
          const { volume } = payload ?? {};
          if (volume == null) {
            console.warn(volume + ' volume was retured from backend');
            return;
          }
          this.store.dispatch(new VolumeOutputActions.ServerSetVolume(Math.floor(volume)));
        },
      );
    }, 3000);
  }

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
    { volume }: VolumeOutputActions.ServerSetVolume,
  ) {
    _ctx.setState(
      patch({
        devices: patch({
          mydevice: patch({
            volume,
          }),
        }),
      }),
    );
  }
}
