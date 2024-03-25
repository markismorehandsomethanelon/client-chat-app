import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Conversation } from 'src/app/models/conversation';
import { GroupConversation } from 'src/app/models/group-conversation';
import { MultimediaMessage } from 'src/app/models/multimedia-message';
import { TextMessage } from 'src/app/models/text-message';
import { ConversationService } from 'src/app/services/conversation.service';
import { SessionService } from 'src/app/services/session.service';
import { FileUtil } from 'src/app/utils/file-util';
import { HashMapUtil } from 'src/app/utils/hashmap-util';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css']
})
export class ConversationListComponent implements OnInit, OnDestroy {

  conversations: Map<number, Conversation> = new Map<number, Conversation>();
  filteredConversations: Map<number, Conversation> = new Map<number, Conversation>();

  conversationsSubscription: Subscription;

  selectedConversationId!: number;

  avatarsFetched: boolean = false;

  constructor(private conversationService: ConversationService,
    private router: Router){
  }

  ngOnInit(): void {

    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe((event: NavigationEnd) => {
    //   if (event.url === '/conversations') {
    //     this.selectedConversationId = undefined;
    //   }
    // });

    console.log("SELECTED CONVERSATION" + this.selectedConversationId);

    this.conversationsSubscription = this.conversationService.onConversationsChanged()
      .subscribe((changedConversations: Map<number, Conversation>) => {
          this.conversations = changedConversations;
          this.filteredConversations = this.conversations;
      });

    this.conversationService.subscribeMarkAllMessagesAsRead();
    this.conversationService.subscribeMarkMessageAsRead();

    this.conversationService.findByMember(SessionService.getCurrentUser()).subscribe();
  }

  ngOnDestroy(): void {
    this.conversationsSubscription.unsubscribe();
  }

  getConversationsAsArray(): Conversation[] {
    return HashMapUtil.getAsArray(this.filteredConversations);
  }

  getConversationAvatar(conversation: Conversation): string {

    if (GroupConversation.isGroupConversation(conversation)){
      const groupConversation: GroupConversation = (conversation as GroupConversation);
      return FileUtil.getBase64FromBinary(groupConversation.avatarFile.data, groupConversation.avatarFile.contentType);
    }

    const CURRENT_USER = SessionService.getCurrentUser();
    const otherUser = conversation.members.find(member => member.id !== CURRENT_USER.id);

    return FileUtil.getBase64FromBinary(otherUser.avatarFile.data, otherUser.avatarFile.contentType);
  }

  getConversationName(conversation: Conversation): string {    
    if (GroupConversation.isGroupConversation(conversation)){
      return (conversation as GroupConversation).name;
    }

    const CURRENT_USER = SessionService.getCurrentUser();
    const otherUser = conversation.members.find(member => member.id !== CURRENT_USER.id);
    return otherUser.name;
  }

  getLastestMessage(conversation: Conversation): string {
    if (conversation.lastestMessage === null) {
      return '';
    }
    
    if (TextMessage.isTextMessage(conversation.lastestMessage)) {
      return `${conversation.lastestMessage.sender.name}: ${(conversation.lastestMessage as any).content}`;
    }

    const multimediaMessage: MultimediaMessage = conversation.lastestMessage as MultimediaMessage;

    let LASTEST_MESSAGE_CONTENT: string = `${multimediaMessage.sender.name} has sent`;

    if (MultimediaMessage.isOtherType(multimediaMessage)){
      return `${LASTEST_MESSAGE_CONTENT} a file`;
    }
    
    return `${multimediaMessage.sender.name} has sent a ${multimediaMessage.type}`;
  }


  search(value: string): void {
    // const filteredConversations = this.conversations.filter(conversation => {
    //   const lowercaseValue = value.toLowerCase();
    //   const CURRENT_USER = SessionService.getCurrentUser();
      
    //   return (conversation as any).name.toLowerCase().includes(lowercaseValue) ||
    //          conversation.members.find(member => member.id !== CURRENT_USER.id && member.name.toLowerCase().includes(lowercaseValue));
    // });
    // this.filteredConversations = filteredConversations;
    // this.router.navigate(['/conversations']);
  }
}
