import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/search?query=${encodeURIComponent(query)}`);
  }

  getAllUsers(pageNumber: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/allusers?pageNumber=${pageNumber}`);
  }
  getUserById(id: Number):Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/${id}`)
    }
}
