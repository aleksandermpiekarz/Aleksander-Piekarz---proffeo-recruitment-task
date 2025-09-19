import { Component, inject } from '@angular/core';
import { PostDetailsStoreService } from '../../core/store/post-details.store';
import {ActivatedRoute, RouterLink} from '@angular/router';

@Component({
  selector: 'app-post-details',
  imports: [RouterLink],
  templateUrl: './post-details.component.html',
  providers: [PostDetailsStoreService],
})
export class PostDetailsComponent {
  public postDetailsStoreService = inject(PostDetailsStoreService);

  public constructor(private route: ActivatedRoute) {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : 0;

    if (id > 0) {
      this.postDetailsStoreService.load(id);
    }
  }

  public toggleFavorite(id: number): void {
    this.postDetailsStoreService.toggleFavorite(id);
  }
}
