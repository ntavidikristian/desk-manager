import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { Store } from '@ngxs/store';
import { VolumeOutputActions } from './features/volume-outputs/state/volume-output.actions';

@Component({
  selector: 'app-root',
  imports: [FormsModule, MatSliderModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('DeskManager.Client');
  private readonly store = inject(Store)  

  protected readonly volume = signal(10);

  constructor() {
    effect(() => {
      const volume = this.volume() ?? 0;

      this.store.dispatch(new VolumeOutputActions.ClientSetVolume(volume));
    });
  }
}
