import { Component, inject } from '@angular/core';
import { PostDetailsStoreService } from '../../core/store/post-details.store';

@Component({
  selector: 'app-post-details',
  imports: [],
  templateUrl: './post-details.component.html',
})
export class PostDetailsComponent {
  public postDetailsStoreService = inject(PostDetailsStoreService);
}
