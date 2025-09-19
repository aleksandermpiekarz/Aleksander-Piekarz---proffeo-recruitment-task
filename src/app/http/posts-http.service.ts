import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Post} from '../types/post';

@Injectable({ providedIn: 'root' })
export class PostsHttpService {
  private baseUrl: string = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  public getPosts(userId: number | null): Observable<Post[]> {
    const url = userId !== null ? `${this.baseUrl}/?userId=${userId}` : this.baseUrl;
    return this.http.get<Post[]>(url);
  }
}
