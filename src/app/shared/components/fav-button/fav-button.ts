import {Component, inject, input} from '@angular/core';
import {FavoritesStoreService} from '../../../core/store/favourites.store';

@Component({
  selector: 'app-fav-button',
  imports: [],
  templateUrl: './fav-button.html'
})
export class FavButton {
  public favoritesStoreService = inject(FavoritesStoreService)
  public postId = input<number>(-1);
}
