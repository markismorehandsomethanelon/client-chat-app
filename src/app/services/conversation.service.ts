import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { API_BASE_URL } from '../config';
import { HttpClient } from '@angular/common/http';
import { GroupConversation } from '../models/group-conversation';
import { User } from '../models/user';
import { Conversation } from '../models/conversation';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ConversationService {

    private conversationUrl = `${API_BASE_URL}/conversations`;
    private groupConversationUrl = `${API_BASE_URL}/groupConversations`;
    private individualConversationUrl = `${API_BASE_URL}/individualConversations`;
    
    private conversationsSubject = new Subject<void>();

    constructor(private http: HttpClient) {

    }

    findByMember(user: User): Observable<any> {
      return this.http.get(`${this.conversationUrl}/members/${user.id}`);
    }

    findById(id: number): Observable<any> {
      return this.http.get(`${this.conversationUrl}/${id}`);
    }

    createGroupConversation(groupConversation: GroupConversation): Observable<any> {
      // return this.http.post(this.groupConversationUrl, groupConversation);
      return this.http.post<any>(this.groupConversationUrl, groupConversation).pipe(
        tap(() => this.conversationsSubject.next())
      );
    }

    updateGroupConversation(groupConversation: GroupConversation): Observable<any> {
      // return this.http.post(this.groupConversationUrl, groupConversation);
      return this.http.put<any>(this.groupConversationUrl, groupConversation).pipe(
        tap(() => this.conversationsSubject.next())
      );
    }
    
    onConversationsChanged(): Observable<void> {
      return this.conversationsSubject.asObservable();
    }

    // saveIndividualConversation(individualConversation: any): Observable<any> {
    //   return this.http.post(this.groupConversationUrl, individualConversation);
    // }

    notifyConversationsChanged() {
      this.conversationsSubject.next();
    }
  
}
