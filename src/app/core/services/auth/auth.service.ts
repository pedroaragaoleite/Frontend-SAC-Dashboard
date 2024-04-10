import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

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
export class AuthService {

  // holds the current user's state
  // when login method successfully completes is updates "currentUserSubject", wich in turn will update the all subscribers of currentUser
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {

    this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
    // this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }


  login(user: User): Observable<any> {
    return this.http.post<any>(`${url}/auth/login`, user, httpOptions)
      .pipe(
        map(user => {
          if (user) {
            console.log(user.data);
            const userData = user.data;

            this.currentUserSubject.next({
              username: userData.name,
              role: userData.role,
              id: userData.id_user
            })

            localStorage.setItem('user', JSON.stringify(userData))

          }
          return user
        })
      )
  }

  registerUser(user: User): Observable<User> {
    console.log(user);

    return this.http.post<User>(`${url}/auth/register`, user, httpOptions);
  }

  updateUser(user: User, id: any): Observable<User> {
    console.log(id);

    return this.http.put<User>(`${url}/users/${id}`, user, httpOptions);
  }

  deleteUser(user: any): Observable<any> {
    const id = user.id_user;
    console.log(id);

    return this.http.delete<any>(`${url}/delete/${id}`, httpOptions)
  }

  logOut() {
    return this.http.get(`${url}/auth/logout`).subscribe({
      next: (response) => {
        console.log('Logged out successfully. Response:', response);
        this.currentUserSubject.next(null);
        console.log('Removing user from localStorage');
        localStorage.removeItem('user');
        console.log('localStorage after logout:', localStorage.getItem('user'));
      },
      error: (error) => {
        console.error('Logout failed', error);
      }
    });
  }


  private checkLoggedInStatus(): void {
    // Call an endpoint on the server that indicates whether the user is logged in or not
    // checks for the presence of a valid session/cookie and returns user info if valid
    this.http.get<User>(`${url}/auth/verify`, httpOptions).subscribe({
      next: (user) => {
        console.log(user)
        console.log('teste token');

        this.currentUserSubject.next(user);
      },
      error: () => {
        this.currentUserSubject.next(null);
      }
    });
  }

}
