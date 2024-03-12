import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { API_BASE_URL, WEB_SOCKET_PUBLIC_ENDPOINT } from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GroupConversation } from '../models/group-conversation';
import { User } from '../models/user';
import { Conversation } from '../models/conversation';
import { tap } from 'rxjs/operators';
import { SessionService } from './session.service';
import { WebSocketService } from './web-socket.service';
import { Message } from '../models/message';
import { JoinGroupConversationRequest } from '../requests/join-group-conversation.request';
import { LeaveGroupConversationRequest } from '../requests/leave-group-conversation.request';


@Injectable({
  providedIn: 'root'
})
export class ConversationService {

    private CONVERSATIONS_BASE_URL: string = `${API_BASE_URL}/conversations`;
    private GROUP_CONVERSATION_BASE_URL: string = `${API_BASE_URL}/groupConversations`;
    private INDIVIDUAL_CONVERSAION_BASE_URL: string = `${API_BASE_URL}/individualConversations`;
    
    createdConversationsSubject = new Subject<any>();
    updatedConversationSubject = new Subject<any>();
    deletedConversationSubject = new Subject<any>();
    joinedConversationSubject = new Subject<any>();
    
    messagesSubject = new Subject<Message>();

    constructor(private http: HttpClient,
      private websocketService: WebSocketService) {

    }

    findByMember(user: User): Observable<any> {
      const URL = `${this.CONVERSATIONS_BASE_URL}/members/${user.id}`;
      return this.http.get(URL);
    }

    findById(id: number): Observable<any> {
      const URL = `${this.CONVERSATIONS_BASE_URL}/${id}`;
      return this.http.get(URL);
    }

    createGroupConversation(groupConversation: GroupConversation): Observable<any> {
      return this.http.post<any>(this.GROUP_CONVERSATION_BASE_URL, groupConversation);
    }

    updateGroupConversation(groupConversation: GroupConversation): Observable<any> {
      return this.http.put<any>(this.GROUP_CONVERSATION_BASE_URL, groupConversation);
    }

    joinGroupConversation(joinGroupConversationRequest: JoinGroupConversationRequest): Observable<any> {
      const URL = `${this.GROUP_CONVERSATION_BASE_URL}/members`;
      return this.http.post<any>(URL, joinGroupConversationRequest);
    }
    
    leaveGroupConversation(leaveGroupConversationRequest: LeaveGroupConversationRequest): Observable<any> {
      const URL = `${this.GROUP_CONVERSATION_BASE_URL}/members`;
      const OPTIONS = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: leaveGroupConversationRequest
      };

      return this.http.delete<any>(URL, OPTIONS);
    }
    
    onConversationCreated(): Observable<Conversation> {
      return this.createdConversationsSubject.asObservable();
    }

    onConversationUpdated(): Observable<Conversation> {
      return this.updatedConversationSubject.asObservable();
    }

    onConversationDeleted(): Observable<Conversation> {
      return this.deletedConversationSubject.asObservable();
    }

    onMessageChanged(): Observable<Message> {
      return this.messagesSubject.asObservable();
    }

    onConversationJoined(): Observable<Conversation> {
      return this.joinedConversationSubject.asObservable();
    }

    subscribeConversationChannels(conversations: Conversation[], callback: (res: any) => void): void {
      conversations.forEach(conversation => {
          const URL: string = `${WEB_SOCKET_PUBLIC_ENDPOINT}/conversations/${conversation.id}/messages`;
          this.websocketService.subscribe(URL, callback);
      });
    }
    
    sendMessageToChannel(conversation: Conversation, message: Message): void {
      const URL: string = `/app/conversations/${conversation.id}/messages`;
      this.websocketService.send(URL, message);
    }


    
}
