import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Conversation } from 'src/app/models/conversation';
import { GroupConversation } from 'src/app/models/group-conversation';
import { IndividualConversation } from 'src/app/models/individual-conversation';
import { ConversationService } from 'src/app/services/conversation.service';
import { SessionService } from 'src/app/services/session.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css']
})
export class ConversationListComponent implements OnInit {

  conversations: Conversation[] = [];
  filteredConversations: Conversation[] = [];

  conversationsSubscription: Subscription;

  selectedConversationId!: number;

  constructor(private conversationService: ConversationService, 
    private router: Router){
  }

  ngOnInit(): void {
    this.conversationsSubscription = this.conversationService.onConversationsChanged()
      .subscribe((conversations: Conversation[]) => {
          this.conversations = conversations;
          this.filteredConversations = this.conversations;
          console.log(this.conversations);    
      });
    
    this.conversationService.findByMember(SessionService.getCurrentUser()).subscribe();
  }

  ngOnDestroy() {
    this.conversationsSubscription.unsubscribe();
  }

  getConversationAvatar(conversation: Conversation): string {

    // if (conversation.instanceOf === "group") {
    //   return (conversation as GroupConversation).avatar;
    // }

    // const CURRENT_USER = SessionService.getCurrentUser();
    // const otherUser = conversation.members.find(member => member.id !== CURRENT_USER.id);
    // return otherUser.avatar;
    return "";
  }

  getConversationName(conversation: Conversation): string {    
    if (conversation.instanceOf === "group") {
      return (conversation as GroupConversation).name;
    }

    const CURRENT_USER = SessionService.getCurrentUser();
    const otherUser = conversation.members.find(member => member.id !== CURRENT_USER.id);
    return otherUser.name;
  }


  search(value: string): void {
    const filteredConversations = this.conversations.filter(conversation => {
      const lowercaseValue = value.toLowerCase();
      const CURRENT_USER = SessionService.getCurrentUser();
      
      return (conversation as any).name.toLowerCase().includes(lowercaseValue) ||
             conversation.members.find(member => member.id !== CURRENT_USER.id && member.name.toLowerCase().includes(lowercaseValue));
    });
    this.filteredConversations = filteredConversations;
    this.router.navigate(['/conversations']);
  }
}
