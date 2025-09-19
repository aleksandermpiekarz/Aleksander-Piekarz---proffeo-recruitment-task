import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesStoreService {
  public ids = computed(() => this.idsSignal());

  private idsSignal = signal<Set<number>>(new Set<number>());

  public toggle(postId: number): void {
    const next = new Set(this.idsSignal());

    if (next.has(postId)) {
      next.delete(postId);
    } else {
      next.add(postId);
    }

    this.idsSignal.set(next);
  }

  public has(postId: number): boolean {
    return this.idsSignal().has(postId);
  }
}
