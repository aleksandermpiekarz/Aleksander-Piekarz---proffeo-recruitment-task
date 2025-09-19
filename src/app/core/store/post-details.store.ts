import { Injectable, computed, signal } from '@angular/core';
import {map, of, take, throwError} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PostDetails } from '../../types/post-details';
import { PostsHttpService } from '../../http/posts-http.service';
import { UsersHttpService } from '../../http/users-http.service';
import { PostsStoreService } from './posts.store';
import { FavoritesStoreService } from './favourites.store';

@Injectable()
export class PostDetailsStoreService {
  public loading = computed<boolean>(() => this.loadingSignal());
  public error = computed<unknown>(() => this.errorSignal());
  public data = computed<PostDetails | null>(() => this.dataSignal());

  private loadingSignal = signal<boolean>(true);
  private errorSignal = signal<unknown | null>(null);
  private dataSignal = signal<PostDetails | null>(null);

  constructor(
    private postsHttpService: PostsHttpService,
    private usersHttpService: UsersHttpService,
    private postsStoreService: PostsStoreService,
    private favoritesStoreService: FavoritesStoreService,
  ) {}

  public load(postId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const ensureList$ = this.postsStoreService.hasLoaded()
      ? of([])
      : this.postsStoreService.fetchAndSave(null);

    ensureList$.pipe(
      take(1),
      map(() => this.postsStoreService.getPost(postId)),
      switchMap(post => {
        if (!post) return throwError(() => new Error('Post not found'));
        return this.postsHttpService.getCommentsForPost(postId).pipe(
          switchMap(comments =>
            this.usersHttpService.getUser(post.userId).pipe(
              map(user => ({ post, user, comments }) as PostDetails)
            )
          )
        );
      })
    ).subscribe({
        next: (details: PostDetails): void => {
          this.dataSignal.set(details);
          this.loadingSignal.set(false);
        },
        error: (err: unknown): void => {
          this.errorSignal.set(err);
          this.loadingSignal.set(false);
        }
      });
  }

  public toggleFavorite(postId: number): void {
    this.favoritesStoreService.toggle(postId);
  }

  public isFavorite(postId: number): boolean {
    return this.favoritesStoreService.has(postId);
  }
}
