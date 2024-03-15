import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Conversation } from 'src/app/models/conversation';
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
    private router: Router, 
    private route: ActivatedRoute,
    private webSocketService: WebSocketService) {
  }

  ngOnInit(): void {
    this.conversationsSubscription = this.conversationService.onConversationsChanged()
      .subscribe((conversations: Conversation[]) => {
          this.conversations = conversations;
          this.filteredConversations = this.conversations;
      });
    
    this.conversationService.findByMember(SessionService.getCurrentUser()).subscribe();
  }

  ngOnDestroy() {
    this.conversationsSubscription.unsubscribe();
  }

  getConversationAvatar(conversation: any): string {
    if (conversation.hasOwnProperty('avatar')) {
      return conversation.avatar;
    }
    const CURRENT_USER = SessionService.getCurrentUser();
    const otherUser = conversation.members.find(member => member.id !== CURRENT_USER.id);
    return otherUser.avatar;
  }

  getConversationName(conversation: any): string {    
    if (conversation.hasOwnProperty('name')) {
      return conversation.name;
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
