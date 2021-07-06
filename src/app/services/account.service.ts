import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../models/user";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userSubject: BehaviorSubject<User>
  public user: Observable<User>

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(<string>localStorage.getItem('user')))
    this.user = this.userSubject.asObservable()
  }

  get userValue(): User {
    return this.userSubject.value
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password})
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user))
        this.userSubject.next(user)
        return user
      }))
  }

  logout() {
    localStorage.removeItem('user')
    this.userSubject.next(null!)
    this.router.navigate(['/account/login'])
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/users/register`, user)
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`)
  }

  getById(id: number) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`)
  }

  update (id: number, params:User){
    return this.http.put(`${environment.apiUrl}/users/${id}`, params)
      .pipe(map(x => {
        if (id === this.userValue.id) {
          const user = {...this.userValue, ...params}
          localStorage.setItem('user', JSON.stringify(user))
          this.userSubject.next(user)
        }
        return x
      }))
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/user/${id}`)
      .pipe(map(x => {
        if (id == this.userValue.id) {
          this.logout()
        }
        return x
      }))
  }
}
