import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Conversation } from 'src/app/models/conversation';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { GroupConversationModalService } from 'src/app/services/group-conversation-modal.service';
import { GroupConversationModalComponent } from '../group-conversation-modal/group-conversation-modal.component';
import { ConversationService } from 'src/app/new-services/new-conversation.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SessionService } from 'src/app/services/session.service';
import { TextMessage } from 'src/app/models/text-message';
import { MultimediaMessage } from 'src/app/models/multimedia-message';
import { GroupConversation } from 'src/app/models/group-conversation';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrls: ['./conversation-detail.component.css']
})
export class ConversationDetailComponent implements OnInit {

  conversation: Conversation;

  conversationSubscription: Subscription;

  constructor(private route: ActivatedRoute, private conversationService: ConversationService,
    private groupConversationModalService: GroupConversationModalService,
    private webSocketService: WebSocketService,
    private confirmModalService: ConfirmModalService) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => 
        this.conversationService.findById(+params.get('id'))
      )
    ).subscribe();

    this.conversationSubscription = this.conversationService.onCurrentConversationChanged().subscribe(
      (conversation: Conversation) => {
        this.conversation = conversation;
      }
    );

    // this.subscription = this.conversationService.onMessageChanged().subscribe(
    //   (res: any) => {
    //     if (!res.success){
    //       return;
    //     }
    //     this.conversation.messages.push(res.data);
    //     this.conversation.lastestMessage = res.data ;
    //     this.conversationService.updatedConversationSubject.next({success: true, data: this.conversation});
    // });
  }

  ngOnDestroy() {
    this.conversationSubscription.unsubscribe();
  }


  isSentMessage(message: Message): boolean {
    const CURRENT_USER: User = JSON.parse(sessionStorage.getItem('currentUser'));
    return message.sender.id === CURRENT_USER.id;
  }

  isReceivedMessage(message: Message): boolean {
    const CURRENT_USER: User = JSON.parse(sessionStorage.getItem('currentUser'));
    return message.sender.id !== CURRENT_USER.id;
  }

  openUpdateGroupConversationModal(): void {
    this.groupConversationModalService.openModal(GroupConversationModalComponent, "Update group conversation", this.conversation);
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

    const CURRENT_USER = JSON.parse(sessionStorage.getItem('currentUser'));
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

  // onInput(event: KeyboardEvent, inputElement: HTMLInputElement): void {
    
  //   const key: string = event.key;

  //   console.log(key);

  //   if (key === 'Enter') {
  //   }
  // }

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

  copyLink(): void {
    navigator.clipboard.writeText(`tchat.com/${this.conversation.id}`);
  }

  leaveGroup(): void {
    this.confirmModalService.openModal(ConfirmModalComponent, "LEAVE_GROUP", this.conversation);
  }
}
