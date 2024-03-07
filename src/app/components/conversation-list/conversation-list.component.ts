import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Conversation } from 'src/app/models/conversation';
import { GroupConversation } from 'src/app/models/group-conversation';
import { User } from 'src/app/models/user';
import { ConversationService } from 'src/app/services/conversation.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css']
})
export class ConversationListComponent implements OnInit {

  conversations!: Conversation[];
  filteredConversations!: Conversation[];

  subscription: Subscription;

  selectedConversationId!: number;

  constructor(private conversationService: ConversationService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    
    const CURRENT_USER = JSON.parse(sessionStorage.getItem('currentUser'));

    this.findConversationsOf(CURRENT_USER);

    this.subscription = this.conversationService.onConversationsChanged().subscribe(() => {
      this.findConversationsOf(CURRENT_USER);
    });
  }

  findConversationsOf(CURRENT_USER: User): void {
    this.conversationService.findByMember(CURRENT_USER).subscribe(
      responseSuccess => {
        console.log(responseSuccess.data);
        this.conversations = responseSuccess.data;
        this.filteredConversations = this.conversations;
      },
      responseError => {
        console.log(responseError.error.message);
      }
    );
  }

  getConversationAvatar(conversation: any): string {
    if (conversation.avatar) {
      return conversation.avatar;
    }
    const CURRENT_USER = JSON.parse(sessionStorage.getItem('currentUser'));
    const otherUser = conversation.members.find(member => member.id !== CURRENT_USER.id);
    return otherUser.avatar;
  }

  getConversationName(conversation: any): string {    
    if (conversation.name) {
      return conversation.name;
    }

    const CURRENT_USER = JSON.parse(sessionStorage.getItem('currentUser'));
    const otherUser = conversation.members.find(member => member.id !== CURRENT_USER.id);
    return otherUser.name;
  }


  search(value: string): void {
    const filteredConversations = this.conversations.filter(conversation => {
      const lowercaseValue = value.toLowerCase();
      const CURRENT_USER = JSON.parse(sessionStorage.getItem('currentUser'));
      
      return (conversation as any).name.toLowerCase().includes(lowercaseValue) ||
             conversation.members.find(member => member.id !== CURRENT_USER.id && member.name.toLowerCase().includes(lowercaseValue));
    });
    this.filteredConversations = filteredConversations;
  }
}
