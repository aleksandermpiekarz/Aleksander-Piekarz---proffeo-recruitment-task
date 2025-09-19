import { Injectable, computed, effect, signal } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { PostsHttpService } from '../../http/posts-http.service';
import { FavoritesStoreService } from './favourites.store';
import { Post } from '../../types/post';
import { ListFilters } from '../../types/list-filters';

@Injectable({ providedIn: 'root' })
export class PostsStoreService {
  public searchText = computed<string>(() => this.searchTextSignal());
  public filterUserId = computed<number | null>(() => this.filterUserIdSignal());
  public filterOnlyFavorites = computed<boolean>(() => this.filterOnlyFavoritesSignal());

  public loading = computed<boolean>(() => this.loadingSignal());
  public hasLoaded = computed<boolean>(() => this.hasLoadedSignal());
  public error = computed<unknown>(() => this.errorSignal());

  public posts = computed<Post[]>(() => {
    const data = this.rawPosts();
    const searchText = this.searchTextSignal().toLowerCase();
    const onlyFav = this.filterOnlyFavoritesSignal();

    const byFav = onlyFav ? data.filter((p) => this.favoritesStoreService.has(p.id)) : data;

    if (!searchText) {
      return byFav;
    }

    return byFav.filter(
      (post) =>
        post.title.toLowerCase().includes(searchText) ||
        post.body.toLowerCase().includes(searchText),
    );
  });

  private searchTextSignal = signal<string>('');
  private filterUserIdSignal = signal<number | null>(null);
  private filterOnlyFavoritesSignal = signal<boolean>(false);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<unknown | null>(null);
  private rawPosts = signal<Post[]>([]);

  private hasLoadedSignal = signal<boolean>(false);
  private lastUserIdFetched = signal<number | null>(null);

  public constructor(
    private postsHttpService: PostsHttpService,
    private favoritesStoreService: FavoritesStoreService,
  ) {
    effect((): void => this.ensureLoaded());
  }

  public getPost(postId: number): Post | undefined {
    return this.posts().find((post) => post.id === postId);
  }

  public ensureLoaded(): void {
    if (!this.hasLoadedSignal()) this.fetchAndSaveForCurrentUser(true);
  }

  public applyFilters(filters: ListFilters): void {
    const prevUserId = this.filterUserIdSignal();

    this.searchTextSignal.set(filters.searchText);
    this.filterUserIdSignal.set(filters.userId);
    this.filterOnlyFavoritesSignal.set(filters.onlyFavorites);

    if (prevUserId !== filters.userId) this.fetchAndSaveForCurrentUser(true);
  }

  public fetchAndSave(currentUserId: number | null): Observable<Post[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.postsHttpService.getPosts(currentUserId).pipe(
      tap({
        next: (posts: Post[]): void => {
          this.rawPosts.set(posts);
          this.loadingSignal.set(false);
          this.hasLoadedSignal.set(true);
          this.lastUserIdFetched.set(currentUserId);
        },
        // TODO: No details about errors, need info to fix type
        error: (err: any): void => {
          this.errorSignal.set(err);
          this.loadingSignal.set(false);
        },
      }),
    );
  }

  public fetchAndSaveForCurrentUser(force: boolean): void {
    const currentUserId = this.filterUserIdSignal();
    const last = this.lastUserIdFetched();

    if (!force && this.hasLoadedSignal() && currentUserId === last) {
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.fetchAndSave(currentUserId ?? null)
      .pipe(take(1))
      .subscribe();
  }

  public toggleFavorite(postId: number): void {
    this.favoritesStoreService.toggle(postId);
  }

  public isFavorite(postId: number): boolean {
    return this.favoritesStoreService.has(postId);
  }
}
