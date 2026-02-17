import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private readonly connection = new signalR.HubConnectionBuilder().withUrl('/ws').build();
  private readonly handlers: Record<string, Array<(payload: any) => void>> = {};
  constructor() {
    this.connection.start();
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
}
