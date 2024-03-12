import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GroupConversation } from 'src/app/models/group-conversation';
import { User } from 'src/app/models/user';
import { ConversationService } from 'src/app/new-services/new-conversation.service';
import { GroupConversationModalService } from 'src/app/services/group-conversation-modal.service';

@Component({
  selector: 'app-group-conversation-modal',
  templateUrl: './group-conversation-modal.component.html',
  styleUrls: ['./group-conversation-modal.component.css']
})
export class GroupConversationModalComponent implements OnInit {

  title: string;

  groupConversation: GroupConversation = new GroupConversation();

  @ViewChild('fileInput') fileInput!: ElementRef;

  errorMessage?: string;

  constructor(private groupConversationModalService: GroupConversationModalService,
    private conversationService: ConversationService){

  }
  
  ngOnInit(): void {
  }

  onSave(): void {
    if (this.groupConversation.id){
      this.onUpdate();
      return;
    }
    const CURRENT_USER: User = JSON.parse(sessionStorage.getItem('currentUser'));
    this.groupConversation.ownerId = CURRENT_USER.id;
    this.onCreate(CURRENT_USER);
  }

  onCreate(CURRENT_USER: User): void {
    this.conversationService.createGroupConversation(this.groupConversation).subscribe(
      (groupConversation: GroupConversation) => {
        this.groupConversationModalService.closeModal();
      },
      (errorResponse) => {
        this.errorMessage = errorResponse.error.message;
      }
    );

  }

  onUpdate(): void {
    this.conversationService.updateConversation(this.groupConversation).subscribe(
      (groupConversation: GroupConversation) => {
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

  changeFile(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.groupConversation.avatar = e.target.result.toString();
      };
      reader.readAsDataURL(file);
    }
  }

  chooseFile(): void {
    this.fileInput.nativeElement.click();
  }


}