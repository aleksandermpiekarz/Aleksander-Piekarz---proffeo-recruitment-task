import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../types/user';

@Injectable({ providedIn: 'root' })
export class UsersHttpService {
  private baseUrl: string = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  public getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userId}`);
  }
}
