import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  errorMessage?: string;

  account: Account = new Account();
  
  constructor(private authService: AuthService, private router: Router) {
  }
  ngOnInit(): void {
  }

  signIn(): void {
    this.authService.signIn(this.account)
      .subscribe(
        responseSuccess => {
          // response.data returns user object
          sessionStorage.setItem('currentUser', JSON.stringify(responseSuccess.data));
          this.router.navigate(['/conversations']);
        },
        responseError => {
          this.errorMessage = responseError.error.message;
        }
      );
  }
}
