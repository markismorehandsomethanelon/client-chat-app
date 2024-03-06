import { Component, OnInit } from '@angular/core';
import { ChangePasswordModalService } from 'src/app/services/change-password-modal.service';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent implements OnInit {

  constructor(private changePasswordModalService: ChangePasswordModalService){

  }
  
  ngOnInit(): void {
  }

  onSave(): void {
  }

  onClose(): void {
    this.changePasswordModalService.closeModal();
  }

}
