import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostsStoreService } from '../../core/store/posts.store';
import { GhostLoaders } from '../../shared/components/ghost-loaders/ghost-loaders';
import {FavButton} from '../../shared/components/fav-button/fav-button';

@Component({
  selector: 'app-posts-list',
  imports: [CommonModule, FormsModule, GhostLoaders, FavButton],
  templateUrl: './posts-list.component.html',
})
export class PostsListComponent {
  // TODO: Think if using postsStoreService straight in the template is a good idea
  public postsStoreService = inject(PostsStoreService);

  private filterOnlyFavorites = signal<boolean>(false);
  private filterSearchText = signal<string>('');
  private filterUserId = signal<number | null>(null);

  public constructor(private router: Router) {}

  public apply(): void {
    this.postsStoreService.applyFilters({
      searchText: this.filterSearchText(),
      userId: this.filterUserId(),
      onlyFavorites: this.filterOnlyFavorites(),
    });
  }

  public openDetails(id: number): void {
    this.router.navigate(['/posts', id]);
  }

  public toggleFavorite(id: number): void {
    this.postsStoreService.toggleFavorite(id);
  }

  public filterByFavorites(shouldFilter: boolean): void {
    this.filterOnlyFavorites.set(shouldFilter);
  }

  public filterByUserId(userId: number): void {
    this.filterUserId.set(userId);
  }

  public filterByText(searchText: string): void {
    this.filterSearchText.set(searchText);
  }
}
