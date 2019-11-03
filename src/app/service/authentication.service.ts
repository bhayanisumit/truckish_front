import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../model/users';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, private route:Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser-truckish')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(environment.url + `api/auth`, { email, password })
            .pipe(map(user => {
                console.log(user);
                    if(user['success'] === 'true'){
                        if (user['result'] && user['token']) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser-truckish', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                    }
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser-truckish');
        this.currentUserSubject.next(null);
        this.route.navigate(['login']);
    }
    registerUser (user: User): Observable<User> {
        return this.http.post<User>(environment.url + "api/signup", user);
      }
}