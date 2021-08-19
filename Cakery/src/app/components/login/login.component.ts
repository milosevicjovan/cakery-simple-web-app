import { UsersDataService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  private authStatusSub: Subscription;

  constructor(private usersDataService: UsersDataService) { }

  ngOnInit(): void {
    this.authStatusSub = this.usersDataService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  async onLogin(form: NgForm) {
    await new Promise((resolve, _) => {
      this.usersDataService.login(form.value.username, form.value.password)
    }).then((response) => {
      console.log("Success: ");
      console.log(response);
    }).catch((error) => {
      console.log("Error: ");
      console.log(error);
    })
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
