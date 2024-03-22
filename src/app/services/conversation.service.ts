import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { API_BASE_URL, WEB_SOCKET_PUBLIC_ENDPOINT } from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GroupConversation } from '../models/group-conversation';
import { User } from '../models/user';
import { Conversation } from '../models/conversation';
import { Message } from '../models/message';
import { JoinGroupConversationRequest } from '../requests/join-group-conversation.request';
import { LeaveGroupConversationRequest } from '../requests/leave-group-conversation.request';
import { WebSocketService } from '../services/web-socket.service';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HEADER } from '../config';
import { FileDownloadService } from './file-download.service';
import { SessionService } from './session.service';
import { Util } from '../utils/util';
import { StompService } from './stomp.service';


@Injectable({
  providedIn: 'root'
})
export class ConversationService {

     // urls
     private CONVERSATIONS_BASE_URL: string = `${API_BASE_URL}/conversations`;
     private GROUP_CONVERSATION_BASE_URL = `${API_BASE_URL}/groupConversations`;
     
     // shared conversations
     private conversations: Conversation[] = [];
 
     // current conversation
     private currentConversation?: Conversation;
 
     // conversations subject
     private conversationsSubject: Subject<Conversation[]> = new Subject<Conversation[]>();
     // current conversation subject
     private currentConversationSubject: Subject<Conversation> = new Subject<Conversation>();
    
     constructor(private http: HttpClient, 
        private websocketService: WebSocketService, 
        private stompService: StompService
        ) {
   
     }
 
     onConversationsChanged(): Observable<Conversation[]> {
         return this.conversationsSubject.asObservable();
     }
 
     onCurrentConversationChanged(): Observable<Conversation> {
         return this.currentConversationSubject.asObservable();
     }
 
     // Return as observable<responseDto>
     createConversation(conversation: Conversation): Observable<any>{
         return this.http.post<any>(this.CONVERSATIONS_BASE_URL, conversation).pipe(
             catchError(error => {
                 this.handleError(error);
                 throw error;
             }),
             map((body: any) => {
                 this.conversations.unshift(body.data);
                 this.subscribeConversationChannels([body.data]);
                 this.notifyObservers(this.conversationsSubject, this.conversations);
             })
         );
     }

     createGroupConversation(conversation: Conversation): Observable<any>{
        return this.http.post<any>(this.GROUP_CONVERSATION_BASE_URL, conversation).pipe(
            catchError(error => {
                this.handleError(error);
                throw error;
            }),
            map((body: any) => {
                this.conversations.unshift(body.data);
                this.subscribeConversationChannels([body.data]);
            })
        );
    }
    
 
     updateConversation(conversation: Conversation): Observable<any> {
         return this.http.put<any>(this.GROUP_CONVERSATION_BASE_URL, conversation).pipe(
             catchError(error => {
                 this.handleError(error);
                 throw error;
             }),
             map((body: any) => {
                 const index = this.conversations.findIndex(curConv => curConv.id === body.data.id);
                 if (index !== -1) {
                     this.conversations[index] = body.data;
                     this.notifyObservers(this.conversationsSubject, this.conversations);
                 }
             })
         );
     }
 
     deleteConversation(conversationId: number): Observable<any> {
         return this.http.delete<any>(`${this.CONVERSATIONS_BASE_URL}/${conversationId}`).pipe(
             catchError(error => {
                 this.handleError(error);
                 throw error;
             }),
             map((body: any) => {
                 const conversation: Conversation = this.conversations.find(currentConversation => currentConversation.id !== conversationId);
                 this.conversations = this.conversations.filter(currentConversation => currentConversation.id !== conversationId);
                 this.unsubscribeConversationChannel(conversation);
                 this.notifyObservers(this.conversationsSubject, this.conversations);
             })
         );
     }
 
     joinGroupConversation(joinGroupConversationRequest: JoinGroupConversationRequest): Observable<any> {
         const URL = `${this.CONVERSATIONS_BASE_URL}/members`;
         return this.http.post<any>(URL, joinGroupConversationRequest).pipe(
             catchError(error => {
                 this.handleError(error);
                 throw error;
             }),
             map((body: any) => {
                 this.conversations.unshift(body.data);
                 this.subscribeConversationChannels([body.data]);
                 this.notifyObservers(this.conversationsSubject, this.conversations);
             })
         );
     }
 
     // Return as observable<responseDto>
     // Body.data is list conversation object
     findByMember(member: User): Observable<any> {
         return this.http.get<any>(`${this.CONVERSATIONS_BASE_URL}/members/${member.id}`).pipe(
             catchError(error => {
                 this.handleError(error);
                 throw error;
             }),
             map((body: any) => {
                 this.conversations = body.data;
                 this.subscribeConversationChannels(this.conversations);
                 this.notifyObservers(this.conversationsSubject, this.conversations);
             })
         );
     }
 
     leaveGroupConversation(leaveGroupConversationRequest: LeaveGroupConversationRequest): Observable<any> {
         const URL = `${this.CONVERSATIONS_BASE_URL}/members`;
         const OPTIONS = {
             headers: HEADER,
             body: leaveGroupConversationRequest
         };
         return this.http.delete<any>(URL, OPTIONS).pipe(
             catchError(error => {
                 this.handleError(error);
                 throw error;
             }),
             map((body: any) => {
                 const conversation: Conversation = this.conversations.find(currentConversation => currentConversation.id === leaveGroupConversationRequest.conversationId);
                 this.conversations = this.conversations.filter(currentConversation => currentConversation.id !==  leaveGroupConversationRequest.conversationId);
                 this.unsubscribeConversationChannel(conversation);
                 this.notifyObservers(this.conversationsSubject, this.conversations);
             })
         );
     }
 
     // Body.data is conversation object
     findById(id: number): Observable<any> {
         const URL = `${this.CONVERSATIONS_BASE_URL}/${id}`;
         return this.http.get<any>(URL).pipe(
             catchError(error => {
                 this.handleError(error);
                 throw error;
             }),
             map((body: any) => {
                 this.currentConversation = body.data;
                 this.notifyObservers(this.currentConversationSubject, this.currentConversation);
             })
         );
     }
 
     private handleError(error: any): void {
         console.error('Error:', error);
     }
 
     private notifyObservers(subject: Subject<any>, data: any): void {
         subject.next(data);
     }
 
     subscribeConversationChannels(conversations: Conversation[]): void {
         conversations.forEach(conversation => {
             const URL: string = `${WEB_SOCKET_PUBLIC_ENDPOINT}/conversations/${conversation.id}/messages`;
             this.stompService.watch(URL, (res: any) => {
                if (!res.success){
                    console.log(res.message);
                }

                 const message: Message = res.data as Message;
                 const conversation = this.conversations.find(conv => conv.id === message.conversationId);
                 this.conversations = this.conversations.filter(conv => conv.id !== conversation.id);
                 this.conversations.unshift(conversation);
                 
                 if (conversation) {
                     if (conversation.messages == null){
                         conversation.messages = [];
                     }
                     conversation.messages.push(message);
                     conversation.lastestMessage = message;
                     if (this.currentConversation && this.currentConversation.id == conversation.id) {
                         this.currentConversation = conversation;
                         this.notifyObservers(this.currentConversationSubject, this.currentConversation);
                     }
                 }
                 this.notifyObservers(this.conversationsSubject, this.conversations);
             });
         });
     }
 
     
 
     unsubscribeConversationChannel(deletedConversation: Conversation): void {
         const URL: string = `${WEB_SOCKET_PUBLIC_ENDPOINT}/conversations/${deletedConversation.id}/textMessages`;
         this.websocketService.unsubscribe(URL, () => {
         });
     }
 
     sendTextMessageToChannel(conversation: Conversation, message: Message): void {
         const URL: string = `/app/conversations/${conversation.id}/textMessages`;
        //  this.websocketService.send(URL, message);
        // this.newWebSocketService.sendMessage(URL, message);
        // this.stompService.publish({URL, message});
        this.stompService.publish(URL, message);
     }

     sendMultimediaMessageToChannel(conversation: Conversation, message: Message): void {
        const URL: string = `/app/conversations/${conversation.id}/multimediaMessages`;
        this.stompService.publish(URL, message);
    }
    
}
