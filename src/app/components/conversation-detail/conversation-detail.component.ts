import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Conversation } from 'src/app/models/conversation';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { GroupConversationModalService } from 'src/app/services/group-conversation-modal.service';
import { GroupConversationModalComponent } from '../group-conversation-modal/group-conversation-modal.component';
import { ConversationService } from 'src/app/services/conversation.service';
import { SessionService } from 'src/app/services/session.service';
import { TextMessage } from 'src/app/models/text-message';
import { MultimediaMessage } from 'src/app/models/multimedia-message';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { LeaveGroupConversationRequest } from 'src/app/requests/leave-group-conversation.request';
import { Util } from 'src/app/utils/util';
import { GroupConversation } from 'src/app/models/group-conversation';
import { DomSanitizer } from '@angular/platform-browser';
import { FileData } from 'src/app/models/file-data';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrls: ['./conversation-detail.component.css']
})
export class ConversationDetailComponent implements OnInit {

  conversation: Conversation;

  @ViewChild('fileInput') fileInput: any;
  @ViewChildren('messageElements') messageElements: QueryList<ElementRef>;

  private conversationSubscription: Subscription;

  private LEAVE_GROUP_CONTENT: string = "Are you sure to leave this group";

  constructor(private route: ActivatedRoute, private conversationService: ConversationService,
    private groupConversationModalService: GroupConversationModalService,
    private confirmModalService: ConfirmModalService,
    private router: Router) {}

  ngOnInit(): void {
    this.conversationSubscription = this.conversationService.onCurrentConversationChanged().subscribe(
      (conversation: Conversation) => {
        this.conversation = conversation;
        const firstUnreadMessage = this.conversation.messages.find(message => 
          message.notifications.some(notification => !notification.read) && 
          message.sender.id !== SessionService.getCurrentUser().id
        );
        console.log(this.messageElements);
        if (firstUnreadMessage) {
          const messageElement = this.messageElements.find(messageElement => 
            messageElement.nativeElement.id === firstUnreadMessage.id.toString()
          );
          console.log(messageElement.nativeElement);
          if (messageElement) {
            messageElement.nativeElement.scrollIntoView();
          }
        }
      }
    );

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => 
        this.conversationService.findById(+params.get('id'))
      )
    ).subscribe();
  }

  ngOnDestroy() {
    this.conversationSubscription.unsubscribe();
  }

  getAvatar() {
    if (this.conversation.instanceOf === "GROUP") {
      const groupConversation: GroupConversation = (this.conversation as GroupConversation);
      return Util.getBase64FromBinary(groupConversation.avatarFile.data, groupConversation.avatarFile.contentType);
    }
    const CURRENT_USER = SessionService.getCurrentUser();
    const otherUser = this.conversation.members.find(member => member.id !== CURRENT_USER.id);

    return Util.getBase64FromBinary(otherUser.avatarFile.data, otherUser.avatarFile.contentType);
  }


  isSentMessage(message: Message): boolean {
    const CURRENT_USER: User = SessionService.getCurrentUser();;
    return message.sender.id === CURRENT_USER.id;
  }

  isGroupConversation(): boolean {
    return this.conversation.instanceOf === "GROUP";
  }

  openUpdateGroupConversationModal(): void {
    if (this.conversation.instanceOf === "GROUP") {
      this.groupConversationModalService.openModal(GroupConversationModalComponent, "Update group conversation", this.conversation, true);
    }
  }

  getConversationName(): string {    
    if (this.conversation.instanceOf === "GROUP") {
      return (this.conversation as any).name;
    }

    const CURRENT_USER = SessionService.getCurrentUser();
    const otherUser = this.conversation.members.find(member => member.id !== CURRENT_USER.id);
    return otherUser.name;
  }

  getMessageType(message: Message): string {
    if (message.instanceOf === "TEXT"){
      return message.instanceOf;
    }
    const multimediaMessage: MultimediaMessage = message as MultimediaMessage;
    return multimediaMessage.type;
  }

  sendTextMessage(inputElement: HTMLInputElement): void {
    const message: TextMessage = new TextMessage();
    const sender: User = new User();

    sender.id = SessionService.getCurrentUser().id;

    message.sender = sender;
    message.sentAt = new Date().toISOString();
    message.content = inputElement.value;

    inputElement.value = '';

    this.conversationService.sendTextMessageToChannel(this.conversation, message);
  }

  onCopyLink(): void {
    navigator.clipboard.writeText(`tchat.com/${this.conversation.id}`);
  }

  onLeaveGroup(): void {
    this.confirmModalService.openModal(ConfirmModalComponent, this.LEAVE_GROUP_CONTENT, this.onLeaveGroupCallBack.bind(this));
  }

  onChooseFile(): void {
    this.fileInput.nativeElement.click();
  }

  private getFileType(file: File): string {
    const fileType = file.type;
    const typeMap: { [key: string]: string[] } = {
      'audio': ['audio/mpeg', 'audio/mp3'],
      'video': ['video/mp4', 'video/mpeg'],
      'image': ['image/jpeg', 'image/png', 'image/gif'],
      'document': [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ],
      'pdf': [
        'application/pdf',
      ],
      'sheet': [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      'presentation': [
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ],
      'other': ['application/octet-stream']
    };
  
    for (const type in typeMap) {
      if (typeMap[type].includes(fileType)) {
        return type;
      }
    }
  
    return 'other';
  }

  onFileSelected(event: any) {

    const selectedFile: File = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileType: string = this.getFileType(selectedFile).toUpperCase();

        const message: MultimediaMessage = new MultimediaMessage();
        const sender: User = new User();
    
        sender.id = SessionService.getCurrentUser().id;
    
        message.conversationId = this.conversation.id;
        message.sender = sender;
        message.sentAt = new Date().toISOString();
        message.type = fileType;
        message.fileName = selectedFile.name;
        message.dataFile = new FileData();
        
        message.dataFile.data = e.target.result.toString().split(',')[1];
        message.dataFile.contentType = selectedFile.type;
        message.dataFile.extension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    
        this.conversationService.sendMultimediaMessageToChannel(this.conversation, message);

      };

      reader.readAsDataURL(selectedFile);
    }
  }

  onLeaveGroupCallBack(): void {
    const leaveGroupConversationRequest: LeaveGroupConversationRequest = new LeaveGroupConversationRequest();
    
    console.log(this);

    leaveGroupConversationRequest.conversationId = this.conversation.id;
    leaveGroupConversationRequest.leaverId = SessionService.getCurrentUser().id;

    this.conversationService.leaveGroupConversation(leaveGroupConversationRequest).subscribe(
      () => {
        this.confirmModalService.closeModal();
        this.router.navigate(['/conversations']);
      },
      (errorRes: any) => {
        console.log(errorRes);
      });
  }
}
