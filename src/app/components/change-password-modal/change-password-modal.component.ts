import { Component, OnInit } from '@angular/core';
import { ChangePasswordRequest } from 'src/app/requests/change-password.request';
import { ChangePasswordModalService } from 'src/app/services/change-password-modal.service';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent implements OnInit {


  errorMessage?: string;

  changePasswordRequest?: ChangePasswordRequest = new ChangePasswordRequest();

  constructor(private changePasswordModalService: ChangePasswordModalService){

  }
  
  ngOnInit(): void {
  }

  onSave(confirmPassword: string): void {
    this.errorMessage = '';

    if (confirmPassword !== this.changePasswordRequest.newPassword){
      this.errorMessage = "Passwords are not correct"
      return;
    }

    this.changePasswordRequest.userId = JSON.parse(sessionStorage.getItem('currentUser')).id;
    console.log(this.changePasswordRequest);
    this.changePasswordModalService.saveModal(this.changePasswordRequest);
  }

  onClose(): void {
    this.changePasswordModalService.closeModal();
  }

  showMessage(message: string): void {
    this.errorMessage = message;
  }
}
