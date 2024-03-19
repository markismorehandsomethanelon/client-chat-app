import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserProfileModalService } from 'src/app/services/user-profile-modal.service';

declare const bootstrap: any;

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile-modal.component.html',
  styleUrls: ['./user-profile-modal.component.css']
})
export class UserProfileModalComponent implements OnInit {

  editable: boolean;

  user: User = new User();

  @ViewChild('fileInput') fileInput!: ElementRef;

  errorMessage?: string;

  constructor(private userProfileModalService: UserProfileModalService){

  }
  
  ngOnInit(): void {
  }

  onSave(): void {
    this.userProfileModalService.saveModal(this.user);
  }

  onClose(): void {
    this.userProfileModalService.closeModal();
  }

  setEditable(editable: boolean): void {
    this.editable = editable;
  }

  setObject(user: User): void {
    this.user = user;
  }

  showMessage(message: string): void {
    this.errorMessage = message;
  }

  changeFile(event: any): void {
    // const file: File = event.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     this.user.avatar = e.target.result.toString();
    //   };
    //   reader.readAsDataURL(file);
    // }
  }

  chooseFile(): void {
    this.fileInput.nativeElement.click();
  }

}
