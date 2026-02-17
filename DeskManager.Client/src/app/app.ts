import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { Store } from '@ngxs/store';
import { VolumeOutputActions } from './features/volume-outputs/state/volume-output.actions';
import { VolumeOutputStateSelectors } from './features/volume-outputs/state/volume-output-state.selector';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  imports: [FormsModule, MatSliderModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('DeskManager.Client');
  private readonly store = inject(Store);

  private readonly deviceState = this.store.selectSignal(
    VolumeOutputStateSelectors.selectDeviceState('mydevice'),
  );

  protected readonly serverVolume = computed(() => this.deviceState()?.volume);

  protected readonly isDragging = signal(false);

  protected readonly volume = linkedSignal(() =>
    this.isDragging() ? untracked(this.serverVolume) : this.serverVolume(),
  );

  constructor() {
    effect(() => {
      if (!this.isDragging()) {
        return;
      }
      const volume = this.volume() ?? 0;

      this.store.dispatch(new VolumeOutputActions.ClientSetVolume(volume));
    });
  }
}
