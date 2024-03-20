import { Component, OnInit } from '@angular/core';
import { ChangePasswordRequest } from 'src/app/requests/change-password.request';
import { ChangePasswordModalService } from 'src/app/services/change-password-modal.service';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent implements OnInit {
  changePasswordRequest?: ChangePasswordRequest = new ChangePasswordRequest();

  errorMessage?: string;

  constructor(private changePasswordModalService: ChangePasswordModalService,
    private authService: AuthService){

  }
  
  ngOnInit(): void {
  }

  onSave(): void {
    this.errorMessage = '';

    this.changePasswordRequest.userId = SessionService.getCurrentUser().id;

    this.authService.changePassword(this.changePasswordRequest).subscribe(
      (successRes: any) => {
        this.onClose();
      },
      (errorRes: any) => {
        this.errorMessage = errorRes.error.message;
      }
    );

  }

  onClose(): void {
    this.changePasswordModalService.closeModal();
  }
}
