import { Injectable, computed, effect, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostsHttpService } from '../../http/posts-http.service';
import { FavoritesStoreService } from './favourites.store';
import { Post } from '../../types/post';
import { ListFilters } from '../../types/list-filters';

@Injectable({ providedIn: 'root' })
export class PostsStoreService {
  // TODO: Make them private, set by method
  public searchText = signal<string>('');
  public filterUserId = signal<number | null>(null);
  public filterOnlyFavorites = signal<boolean>(false);

  public loading = computed<boolean>(() => this.loadingSignal());
  public error = computed<unknown>(() => this.errorSignal());

  public posts = computed<Post[]>(() => {
    const data = this.rawPosts();
    const searchText = this.searchText().toLowerCase();
    const onlyFav = this.filterOnlyFavorites();

    const byFav = onlyFav ? data.filter((p) => this.favoritesStoreService.has(p.id)) : data;

    if (!searchText) {
      return byFav;
    }

    return byFav.filter(
      (post) => post.title.toLowerCase().includes(searchText) || post.body.toLowerCase().includes(searchText),
    );
  });

  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<unknown | null>(null);
  private rawPosts = signal<Post[]>([]);
  private hasLoaded = signal<boolean>(false);
  private lastUserIdFetched = signal<number | null>(null);
  private sub: Subscription | null = null;

  public constructor(
    private postsHttpService: PostsHttpService,
    private favoritesStoreService: FavoritesStoreService,
  ) {
    effect((): void => this.ensureLoaded());
  }

  public ensureLoaded(): void {
    if (!this.hasLoaded()) this.fetchForCurrentUser(true);
  }

  public applyFilters(filters: ListFilters): void {
    const prevUserId = this.filterUserId();

    this.searchText.set(filters.searchText);
    this.filterUserId.set(filters.userId);
    this.filterOnlyFavorites.set(filters.onlyFavorites);

    if (prevUserId !== filters.userId) this.fetchForCurrentUser(true);
  }

  public fetchForCurrentUser(force: boolean): void {
    const currentUserId = this.filterUserId();
    const last = this.lastUserIdFetched();

    if (!force && this.hasLoaded() && currentUserId === last) {
      return;
    }

    // TODO: Think about better way to setup data without sub
    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.sub = this.postsHttpService.getPosts(currentUserId ?? null).subscribe({
      next: (posts: Post[]): void => {
        this.rawPosts.set(posts);
        this.loadingSignal.set(false);
        this.hasLoaded.set(true);
        this.lastUserIdFetched.set(currentUserId ?? null);
      },
      // TODO: No details about errors, need info to fix type
      error: (err: any): void => {
        this.errorSignal.set(err);
        this.loadingSignal.set(false);
      },
    });
  }

  public toggleFavorite(postId: number): void {
    this.favoritesStoreService.toggle(postId);
  }

  public isFavorite(postId: number): boolean {
    return this.favoritesStoreService.has(postId);
  }
}
