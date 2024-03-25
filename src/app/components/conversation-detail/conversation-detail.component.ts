import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';
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
import { FileUtil } from 'src/app/utils/file-util';
import { GroupConversation } from 'src/app/models/group-conversation';
import { FileData } from 'src/app/models/file-data';
import { MessageNotification } from 'src/app/models/message-notification';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrls: ['./conversation-detail.component.css']
})
export class ConversationDetailComponent implements OnInit, AfterViewInit, OnDestroy{

  @ViewChild('fileInput') fileInput: any;
  @ViewChildren('messageElements') messageElements: QueryList<ElementRef>;
  @ViewChild('chatWindow') chatWindow: ElementRef;

  conversation: Conversation;
  unreadMessages: Map<number, MessageNotification> = new Map<number, MessageNotification>();

  private conversationSubscription: Subscription;
  private unreadMessagesSubscription: Subscription;

  private LEAVE_GROUP_CONTENT: string = "Are you sure to leave this group";

  private firstUreadMessageId: number = -1;
  
  constructor(private route: ActivatedRoute, private conversationService: ConversationService,
    private groupConversationModalService: GroupConversationModalService,
    private confirmModalService: ConfirmModalService,
    private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => 
        this.conversationService.findById(+params.get('id'))
      )
    ).subscribe(() => {
      this.conversationService.findUnreadMessages(this.conversation.id).subscribe();
    });

    this.unreadMessagesSubscription = this.conversationService.onUnreadMessagesChanged().subscribe(
      (unreadMessages: Map<number, MessageNotification>) => {
        this.unreadMessages = unreadMessages;
      });

    this.conversationSubscription = this.conversationService.onCurrentConversationChanged().subscribe(
      (conversation: Conversation) => {
        this.conversation = conversation;
      }
    );
  }

  ngOnDestroy(): void {
    this.conversationSubscription.unsubscribe();
    this.unreadMessagesSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    combineLatest([
      this.messageElements.changes,
      this.conversationService.onUnreadMessagesChanged()
    ]).subscribe(([messageElements, unreadMessages]) => {
      this.unreadMessages = unreadMessages;
  
      if (this.messageElements.length == 0 || !this.unreadMessages) {
        this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
        return;
      }

      const firstUnreadMessage: MessageNotification = this.unreadMessages.values().next().value;
      
      this.firstUreadMessageId = firstUnreadMessage.messageId;
      
      const messageElement = messageElements.find(messageElement => 
        messageElement.nativeElement.id == firstUnreadMessage.messageId
      );


      // console.log(messageElement.nativeElement);

      if (messageElement == null) {
        return;
      }

      this.chatWindow.nativeElement.scrollTop = messageElement.nativeElement.offsetTop - (messageElement.nativeElement.scrollHeight);
      // console.log(messageElement.nativeElement.offsetTop);
      // this.conversationService.markAllMessagesAsRead(this.conversation.id);
    });

    // this.messageElements.changes.subscribe(
    //   (messageElements: QueryList<ElementRef>) => {

        
    //   }
    // );
  }

  isFirstUnreadMessage(messageId: number): boolean {
    // if (this.unreadMessages.size == 0) {
    //   return false;
    // }

    // const firstUnreadMessage: MessageNotification = this.unreadMessages.values().next().value;
    // return firstUnreadMessage.id === id;
    // return this.unreadMessages.has(id);

    return this.firstUreadMessageId === messageId;
  }

  getAvatar() {
    if (Conversation.isGroupConversation(this.conversation)) {
      const groupConversation: GroupConversation = (this.conversation as GroupConversation);
      return FileUtil.getBase64FromBinary(groupConversation.avatarFile.data, groupConversation.avatarFile.contentType);
    }
    const CURRENT_USER = SessionService.getCurrentUser();
    const otherUser = this.conversation.members.find(member => member.id !== CURRENT_USER.id);
    return FileUtil.getBase64FromBinary(otherUser.avatarFile.data, otherUser.avatarFile.contentType);
  }


  isSentMessage(message: Message): boolean {
    return Message.isSentMessage(message);
  }

  isGroupConversation(): boolean {
    return Conversation.isGroupConversation(this.conversation);
  }

  openUpdateGroupConversationModal(): void {
    if (Conversation.isGroupConversation(this.conversation)) {
      this.groupConversationModalService.openModal(GroupConversationModalComponent, "Update group conversation", this.conversation, true);
    }
  }

  getConversationName(): string {    
    if (Conversation.isGroupConversation(this.conversation)) {
      return (this.conversation as GroupConversation).name;
    }
    const CURRENT_USER = SessionService.getCurrentUser();
    return this.conversation.members.find(member => member.id !== CURRENT_USER.id).name;
  }

  getMessageType(message: Message): string {
    if (Message.isTextMessage(message)){
      return message.instanceOf;
    }
    return (message as MultimediaMessage).type;
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

  

  onFileSelected(event: any) {

    const selectedFile: File = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileType: string = FileUtil.getType(selectedFile);

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
