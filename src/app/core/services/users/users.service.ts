import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../interfaces/user';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true,
};

const url = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getRoles(): Observable<any> {
    return this.http.get<any>(`${url}/roles`, httpOptions);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${url}/users`, httpOptions);
  }

  getOutboundUsers(): Observable<User> {
    return this.http.get<User>(`${url}/outbound`, httpOptions);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${url}/users/${id}`, httpOptions)
  }
}
