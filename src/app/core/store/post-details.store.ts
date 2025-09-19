import { Injectable, computed, signal } from '@angular/core';
import { map, Subscription } from 'rxjs';
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

  private sub: Subscription | null = null;

  constructor(
    private postsHttpService: PostsHttpService,
    private usersHttpService: UsersHttpService,
    private postsStoreService: PostsStoreService,
    private favoritesStoreService: FavoritesStoreService,
  ) {}

  public load(postId: number): void {
    const post = this.postsStoreService.getPost(postId);

    if (!post) {
      this.dataSignal.set(null);
      this.loadingSignal.set(false);
      return;
    }

    // TODO: Think about better way to setup data without sub
    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // TODO: Check if posts list has beed called, if not, call it

    this.sub = this.postsHttpService
      .getCommentsForPost(postId)
      .pipe(
        switchMap((comments) =>
          this.usersHttpService
            .getUser(post.userId)
            .pipe(map((user) => ({ post, user, comments: comments }) as PostDetails)),
        ),
      )
      .subscribe({
        next: (postDetails: PostDetails): void => {
          this.dataSignal.set(postDetails);
          this.loadingSignal.set(false);
        },
        // TODO: No details about errors, need info to fix type
        error: (err: unknown): void => {
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
