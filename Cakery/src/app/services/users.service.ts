import { NewUser } from './../models/new-user.model';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

const api = environment.serviceApi;
const loginApi = environment.loginApi;

@Injectable({providedIn: 'root'})
export class UsersDataService {

    private isAuthenticated = false;
    private token: string;
    private username: string;
    private authStatusListener = new Subject<boolean>();
    private tokenTimer: any;

    private user: User;

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getUsername() {
        return this.username;
    }

    getCurrentUser() {
        return this.http.get<User>(api + "users/current");
    }

    register(newUser: NewUser) {
        const headerDict = {
            'Content-Type': 'text/json'
        };

        const requestOptions = {
            headers: new HttpHeaders(headerDict);
        };

        this.http.post(api + '/account/register', JSON.stringify(newUser), requestOptions)
        .subscribe(() => {
            this.router.navigate(['/login']);
        }, error => {
            this.authStatusListener.next(false);
        })
    }

    async login(username: string, password: string) {
        const authData = "username=" + username + "&password=" + password + "&grant_type=password";
        await new Promise((resolve, _) => {
            this.http.post<{ access_token: string, expires_in: number; userName: string }>
            (loginApi, authData).subscribe(response => {
                const token = response.access_token;
                this.token = token;
                if (token) {
                    const expiresInDuration = response.expires_in;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    this.username = response.userName;
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token, expirationDate, this.username);
                    this.router.navigate(['/products']);
                    this.getCurrentUser().subscribe((currentUser: User) => {
                        this.user = currentUser;
                    });
                    resolve(this.user);
                }
            }, error => {
                this.authStatusListener.next(false);
                console.log(error);
            });
        });
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logOut();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, username: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('username', username);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('username');
    }

    logOut() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.username = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/login']);
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const username = localStorage.getItem('username');
        if (!token || !expirationDate) {
            return;
        }

        return {
            token: token,
            expirationDate: new Date(expirationDate),
            username: username
        }
    }
}