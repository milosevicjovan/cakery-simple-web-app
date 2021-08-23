import { UsersDataService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  private authStatusSub: Subscription;

  public username: string;
  public password: string;

  public loggedUser: User;

  public hasError: boolean = false;

  constructor(private usersDataService: UsersDataService) { }

  ngOnInit(): void {
    this.authStatusSub = this.usersDataService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  async onLogin() {
    this.isLoading = true;
    this.usersDataService.login(this.username, this.password).then(() => {
      this.getCurrentUser().then(() => {
        this.isLoading = false;
      });
    }).catch(error => {
      this.hasError = true;
      this.isLoading = false;
    });
  }

  async getCurrentUser() {
    await new Promise((resolve, _) => {
      this.usersDataService.getCurrentUser().subscribe(user => {
        this.loggedUser = user;
        resolve(user);
      });
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
