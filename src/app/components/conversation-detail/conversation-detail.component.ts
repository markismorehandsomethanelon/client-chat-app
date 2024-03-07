import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Conversation } from 'src/app/models/conversation';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { GroupConversationModalService } from 'src/app/services/group-conversation-modal.service';
import { GroupConversationModalComponent } from '../group-conversation-modal/group-conversation-modal.component';
import { ConversationService } from 'src/app/services/conversation.service';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrls: ['./conversation-detail.component.css']
})
export class ConversationDetailComponent implements OnInit {

  conversation: Conversation;

  avatar: string;

  constructor(private route: ActivatedRoute, private conversationService: ConversationService,
    private groupConversationModalService: GroupConversationModalService
    ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.conversationService.findById(+params.get('id')))
    ).subscribe(
      (successResponse) => {
        this.conversation = successResponse.data;
        this.avatar = this.getConversationAvatar();
      },
      error => {
        console.error('Error fetching conversation:', error);
      }
    );
  }

  onClick(): void {
    // this.conversation$.subscribe(conversation => {
    //   // conversation.messages.push(new Message(2, new User(3, "zxczxc"), "bew", "2002"));
    // })
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
    
    const CURRENT_USER = JSON.parse(sessionStorage.getItem('currentUser'));
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

}
