import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-posts-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './posts-list.component.html',
})
export class PostsListComponent {
  // Temporary mock
  public posts = signal<any>([
    {
      userId: 1,
      id: 1,
      title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
    },
    {
      userId: 1,
      id: 2,
      title: 'qui est esse',
      body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla',
    },
  ]);

  public constructor(private router: Router) {}

  public apply(): void {}

  public openDetails(id: number): void {
    this.router.navigate(['/posts', id]);
  }

  public toggleFavorite(id: number): void {}

  public filterOnlyFavorites(shouldFilter: boolean): void {}

  public filterByUserId(userId: number): void {}

  public filterByText(searchText: string): void {}
}
