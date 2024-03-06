import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Conversation } from 'src/app/models/conversation';
import { ConversationService } from 'src/app/services/conversation.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css']
})
export class ConversationListComponent implements OnInit {

  conversations$!: Observable<Conversation[]>;
  filteredConversations$!: Observable<Conversation[]>;

  selectedConversationId!: number;

  constructor(private conversationService: ConversationService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.conversations$ = this.conversationService.findAll();
  }

  search(value: string): void {
    // this.filteredConversations$ = this.conversations$.pipe(
    //   map(conversations => conversations.filter(conversation => conversation.)
    // );

  }
}
