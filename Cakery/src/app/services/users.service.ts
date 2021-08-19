import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { User } from '../models/user.model';

const api = environment.serviceApi;

@Injectable({providedIn: 'root'})
export class UsersDataService {
    constructor(private http: HttpClient) {}

    getCurrentUser() {
        return this.http.get<User[]>(api + "users/current");
    }

    login() {
        // TO DO
    }

    logOut() {
        // TO DO
    }
}