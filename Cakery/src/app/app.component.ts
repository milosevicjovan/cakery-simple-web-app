import { UsersDataService } from './services/users.service';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Cakery';

  constructor(private usersDataService: UsersDataService) {}

  ngOnInit() {
    this.usersDataService.autoAuthUser();
  }
}
