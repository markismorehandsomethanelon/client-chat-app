import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Conversation } from 'src/app/models/conversation';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { GroupConversationModalService } from 'src/app/services/group-conversation-modal.service';
import { GroupConversationModalComponent } from '../group-conversation-modal/group-conversation-modal.component';
import { ConversationService } from 'src/app/new-services/new-conversation.service';
import { SessionService } from 'src/app/services/session.service';
import { TextMessage } from 'src/app/models/text-message';
import { MultimediaMessage } from 'src/app/models/multimedia-message';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { LeaveGroupConversationRequest } from 'src/app/requests/leave-group-conversation.request';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrls: ['./conversation-detail.component.css']
})
export class ConversationDetailComponent implements OnInit {

  conversation: Conversation;

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


  isSentMessage(message: Message): boolean {
    const CURRENT_USER: User = SessionService.getCurrentUser();;
    return message.sender.id === CURRENT_USER.id;
  }

  isGroupConversation(): boolean {
    return this.conversation.hasOwnProperty('avatar');
  }

  openUpdateGroupConversationModal(): void {
    if (this.isGroupConversation()) {
      this.groupConversationModalService.openModal(GroupConversationModalComponent, "Update group conversation", this.conversation);
    }
  }

  getConversationAvatar(): string {
    if (this.conversation.hasOwnProperty('avatar')) {
      return (this.conversation as any).avatar;
    }
    const CURRENT_USER = SessionService.getCurrentUser();
    const otherUser = this.conversation.members.find(member => member.id !== CURRENT_USER.id);
    return otherUser.avatar;
  }

  getConversationName(): string {    
    if (this.conversation.hasOwnProperty('name')) {
      return (this.conversation as any).name;
    }

    const CURRENT_USER = SessionService.getCurrentUser();
    const otherUser = this.conversation.members.find(member => member.id !== CURRENT_USER.id);
    return otherUser.name;
  }

  getMessageType(message: Message): string {
    if (message.hasOwnProperty('content')){
      return 'TEXT';
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

    this.conversationService.sendMessageToChannel(this.conversation, message);
  }

  onCopyLink(): void {
    navigator.clipboard.writeText(`tchat.com/${this.conversation.id}`);
  }

  onLeaveGroup(): void {
    this.confirmModalService.openModal(ConfirmModalComponent, this.LEAVE_GROUP_CONTENT, this.onLeaveGroupCallBack.bind(this));
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
