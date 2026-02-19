import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import * as signalR from '@microsoft/signalr';
import { WebsocketSubscription } from '../enums/websocket-subscription.enum';
import { Store } from '@ngxs/store';
import { VolumeOutputServerEventsMap } from '@app/features/volume-outputs/models/volume-ouput-server-events.model';
import { VolumeOutputActions } from '@app/features/volume-outputs/state/volume-output.actions';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private readonly store = inject(Store);
  private readonly connection = new signalR.HubConnectionBuilder().withUrl('/ws').build();
  private readonly handlers: Record<string, Array<(payload: any) => void>> = {};

  private readonly _connected = signal(false);
  public readonly connected = this._connected.asReadonly();

  public readonly connected$ = toObservable(this.connected);

  constructor() {
    this.connection.start().then(() => {
      this._connected.set(true);
      this.initializeEvents();
      this.connection.send('getEvents', WebsocketSubscription.AudioOutput);
    });
  }

  public sendItem(type: string, payload: any) {
    if (!(this.connection.state === signalR.HubConnectionState.Connected)) {
      return;
    }
    this.connection.send(type, payload);
  }

  public registerEventHandler<
    EventMapping extends Record<string, any>,
    Event extends keyof EventMapping,
  >(eventName: Event, handler: (payload: EventMapping[Event]) => void) {
    let existing = this.handlers[eventName as string];
    if (!existing) {
      existing = this.handlers[eventName as string] = [];
      // this.connection.on
      this.connection.on(eventName as string, (payload) => {
        const handlers = this.handlers[eventName as string] ?? [];
        handlers.forEach((handler) => {
          try {
            handler(payload);
          } catch {}
        });
      });
    }
    existing.push(handler);
  }

  private initializeEvents(): void {
    this.registerEventHandler<VolumeOutputServerEventsMap, 'volumeChange'>(
      'volumeChange',
      (payload) => {
        const { volume, deviceId } = payload ?? {};
        if (volume == null || !deviceId) {
          console.warn(volume + ' volume was retured from backend');
          return;
        }
        this.store.dispatch(new VolumeOutputActions.ServerSetVolume(Math.floor(volume), deviceId));
      },
    );

    this.registerEventHandler<VolumeOutputServerEventsMap, 'outputSnapshots'>(
      'outputSnapshots',
      ({ snapshots, defaultDeviceId }) => {
        this.store.dispatch(new VolumeOutputActions.ServerAudioOutputSnapshots(snapshots, defaultDeviceId));
      },
    );
  }
}
