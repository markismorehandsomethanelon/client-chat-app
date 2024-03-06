import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Conversation } from 'src/app/models/conversation';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { ConversationService } from 'src/app/services/conversation.service';
import { GroupConversationModalService } from 'src/app/services/group-conversation-modal.service';
import { GroupConversationModalComponent } from '../group-conversation-modal/group-conversation-modal.component';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrls: ['./conversation-detail.component.css']
})
export class ConversationDetailComponent implements OnInit {

  conversation$: Observable<Conversation>;

  constructor(private route: ActivatedRoute, private conversationService: ConversationService,
    private groupConversationModalService: GroupConversationModalService
    ) {}

  ngOnInit(): void {
    this.conversation$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.conversationService.findById(+params.get('id')!)));
  }

  onClick(): void {
    this.conversation$.subscribe(conversation => {
      // conversation.messages.push(new Message(2, new User(3, "zxczxc"), "bew", "2002"));
    })

  }

  openUpdateGroupConversationModal(): void {
    this.groupConversationModalService.openModal(GroupConversationModalComponent, "Update group conversation");
  }

}
