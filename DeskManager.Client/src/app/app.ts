import { Component, effect, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { RouterOutlet } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { SetVolumeDto } from './features/volume-outputs/models/set-volume.dto';

@Component({
  selector: 'app-root',
  imports: [FormsModule, MatSliderModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('DeskManager.Client');
  protected readonly connection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5066/ws')
    .build();

  protected readonly volume = signal(10);

  constructor() {
    this.connection.start();
    effect(() => {
      const volume = this.volume() ?? 0;
      ('');
      if (!(this.connection.state == signalR.HubConnectionState.Connected)) {
        return;
      }

      this.connection.send('setVolume', { volume } satisfies SetVolumeDto);
    });
  }
}
