import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ghost-loaders',
  imports: [],
  templateUrl: './ghost-loaders.html',
})
export class GhostLoaders {
  public ghostsCount = input<number>(1);
}
