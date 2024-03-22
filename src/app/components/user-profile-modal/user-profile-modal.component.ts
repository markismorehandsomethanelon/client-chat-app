import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserProfileModalService } from 'src/app/services/user-profile-modal.service';
import { UserService } from 'src/app/services/user.service';
import { catchError, map } from 'rxjs/operators';
import { Util } from 'src/app/utils/util';

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

  constructor(private userProfileModalService: UserProfileModalService,
    private userService: UserService){

  }
  
  ngOnInit(): void {
    console.log(this.user);
  }

  onSave(): void {
    this.userService.save(this.user).subscribe(
      (successRes: any) => {
        this.onClose()
      },
      (errorRes: any) => {
        this.errorMessage = errorRes.error.message
      } 
    );
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


  getAvatar(): string {
    return Util.getBase64FromBinary(this.user.avatarFile.data, this.user.avatarFile.contentType);
  }

  changeFile(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.user.avatarFile.data = e.target.result.toString().split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }

  chooseFile(): void {
    this.fileInput.nativeElement.click();
  }

}
