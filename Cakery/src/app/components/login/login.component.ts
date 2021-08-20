import { UsersDataService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user.model';

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

  constructor(private usersDataService: UsersDataService) { }

  ngOnInit(): void {
    this.authStatusSub = this.usersDataService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onClick() {
    console.log(this.username);
  }

  async onLogin() {
    await new Promise((resolve, _) => {
      this.usersDataService.login(this.username, this.password)
    }).then((response) => {
      console.log("Success: ");
      console.log(response);
      console.log(this.loggedUser);
    }).catch((error) => {
      console.log("Error: ");
      console.log(error);
    })
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
