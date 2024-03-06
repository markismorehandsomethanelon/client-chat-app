import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  
  errorMessage?: string;

  account: Account = new Account();
  
  constructor(private authService: AuthService, private router: Router) {
  }
  ngOnInit(): void {
  }

  private isValidPassword(account: Account, confirmPassword: string){
    return account.password === confirmPassword;
  }

  signUp(confirmPassword: string): void {

    if (!this.isValidPassword(this.account, confirmPassword)){
      this.errorMessage = "Passwords do not match";
      // Early return technique
      return;
    }

    this.authService.signUp(this.account)
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
