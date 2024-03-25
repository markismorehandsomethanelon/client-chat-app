import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GroupConversation } from 'src/app/models/group-conversation';
import { User } from 'src/app/models/user';
import { ConversationService } from 'src/app/services/conversation.service';
import { FileDownloadService } from 'src/app/services/file-download.service';
import { GroupConversationModalService } from 'src/app/services/group-conversation-modal.service';
import { SessionService } from 'src/app/services/session.service';
import { FileUtil } from 'src/app/utils/file-util';

@Component({
  selector: 'app-group-conversation-modal',
  templateUrl: './group-conversation-modal.component.html',
  styleUrls: ['./group-conversation-modal.component.css']
})
export class GroupConversationModalComponent implements OnInit {

  title: string;
  errorMessage?: string;
  isUpdate: boolean;

  groupConversation: GroupConversation = new GroupConversation();

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private groupConversationModalService: GroupConversationModalService,
    private conversationService: ConversationService,
    private fileDownloadService: FileDownloadService){
  }
  
  ngOnInit(): void {
    if (!this.isUpdate){
      this.fileDownloadService.getFile("elon.png").subscribe(
        (successRes: any) => {
          this.groupConversation.avatarFile = successRes;
        },
        (errorRes: any) => console.log(errorRes.error)
      );
    }
  }
  
  ngOnDestroy(): void {

  }

  onSave(): void {
    if (this.groupConversation.id){
      this.onUpdate();
      return;
    }
    this.onCreate();
  }

  onCreate(): void {

    const CURRENT_USER: User = SessionService.getCurrentUser();

    const member: User = new User();
    member.id = CURRENT_USER.id;

    this.groupConversation.ownerId = CURRENT_USER.id;
    this.groupConversation.members = [member];
    this.groupConversation.avatarFile = this.groupConversation.avatarFile;

    this.conversationService.createGroupConversation(this.groupConversation).subscribe(
      () => {
        this.groupConversationModalService.closeModal();
      },
      (errorResponse) => {
        this.errorMessage = errorResponse.error.message;
      }
    );

  }

  onUpdate(): void {
    this.conversationService.updateConversation(this.groupConversation).subscribe(
      () => {
        this.groupConversationModalService.closeModal();
      },
      (errorResponse) => {
        this.errorMessage = errorResponse.error.message;
      }
    );

  }

  onClose(): void {
    this.groupConversationModalService.closeModal();
  }

  setTitle(title: string): void {
    this.title = title;
  }

  setObject(groupConversation: GroupConversation): void{
    this.groupConversation = groupConversation;
  }

  setIsUpdate(isUpdate: boolean): void {
    this.isUpdate = isUpdate;
  }

  getAvatar() {
    return FileUtil.getBase64FromBinary(this.groupConversation.avatarFile.data, this.groupConversation.avatarFile.contentType);
  }

  changeFile(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.groupConversation.avatarFile.data = e.target.result.toString().split(',')[1];
        this.groupConversation.avatarFile.contentType = file.type;
        this.groupConversation.avatarFile.extension = file.name.split('.').pop()?.toLowerCase() || '';
      };
      reader.readAsDataURL(file);
    }
  }

  chooseFile(): void {
    this.fileInput.nativeElement.click();
  }


}