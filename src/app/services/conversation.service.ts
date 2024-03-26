import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { API_BASE_URL, WEB_SOCKET_PRIVATE_ENDPOINT, WEB_SOCKET_PUBLIC_ENDPOINT } from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GroupConversation } from '../models/group-conversation';
import { User } from '../models/user';
import { Conversation } from '../models/conversation';
import { Message } from '../models/message';
import { JoinGroupConversationRequest } from '../requests/join-group-conversation.request';
import { LeaveGroupConversationRequest } from '../requests/leave-group-conversation.request';
import { catchError, map } from 'rxjs/operators';
import { HEADER } from '../config';
import { SessionService } from './session.service';
import { StompService } from './stomp.service';
import { MessageNotification } from '../models/message-notification';
import { ObserverUtil } from '../utils/observer-util';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

     private CONVERSATIONS_BASE_URL: string = `${API_BASE_URL}/conversations`;
     private GROUP_CONVERSATION_BASE_URL = `${API_BASE_URL}/groupConversations`;
     private MESSAGE_NOTIFICATION_BASE_URL = `${API_BASE_URL}/messageNotifications`;
     
     private conversations: Map<number, Conversation> = new Map();
     private currentConversation?: Conversation;
     private unreadMessages: Map<number, MessageNotification> = new Map();
 
     private conversationsSubject: Subject<Map<number, Conversation>> = new Subject<Map<number, Conversation>>();
     private currentConversationSubject: Subject<Conversation> = new Subject<Conversation>();
     private unreadMessagesSubject: Subject<Map<number, MessageNotification>> = new Subject<Map<number, MessageNotification>>();
    
     constructor(private http: HttpClient, 
        private stompService: StompService) {
   
     }
 
     onConversationsChanged(): Observable<Map<number, Conversation>> {
         return this.conversationsSubject.asObservable();
     }
 
     onCurrentConversationChanged(): Observable<Conversation> {
         return this.currentConversationSubject.asObservable();
     }

     onUnreadMessagesChanged(): Observable<Map<number, MessageNotification>> {
        return this.unreadMessagesSubject.asObservable();
    }

     findByMember(member: User): Observable<any> {
        return this.http.get<any>(`${this.CONVERSATIONS_BASE_URL}/members/${member.id}`).pipe(
            catchError(error => {
                console.log(error);
                throw error;
            }),
            map((body: any) => {
                
                const CONVERSATIONS: Conversation[] = body.data;

                CONVERSATIONS.forEach(conversation => {
                    this.conversations.set(conversation.id, conversation);
                });

                this.subscribeConversationChannels(this.conversations);
                ObserverUtil.notifyObservers(this.conversationsSubject, this.conversations);
            })
        );
    }

    findById(id: number): Observable<any> {
        const URL = `${this.CONVERSATIONS_BASE_URL}/${id}`;
        return this.http.get<any>(URL).pipe(
            catchError(error => {
                console.log(error)
                throw error;
            }),
            map((body: any) => {
                this.currentConversation = body.data;
                ObserverUtil.notifyObservers(this.currentConversationSubject, this.currentConversation);
            })
        );
    }
    
    findUnreadMessages(conversationId: number): Observable<any> {
        const URL = `${this.MESSAGE_NOTIFICATION_BASE_URL}/conversations/${conversationId}/unreadMessages/user/${SessionService.getCurrentUser().id}`;
        return this.http.get<any>(URL).pipe(
            catchError(error => {
                console.log(error)
                throw error;
            }),
            map((body: any) => {
                const unreadMessages: MessageNotification[] = body.data;
                unreadMessages.forEach(unreadMessage => {
                    this.unreadMessages.set(unreadMessage.messageId, unreadMessage);
                });
                ObserverUtil.notifyObservers(this.unreadMessagesSubject, this.unreadMessages);
            })
        );
    }

    clearCurrentConversation(): void {
        this.currentConversation = undefined;
        ObserverUtil.notifyObservers(this.currentConversationSubject, this.currentConversation);
    }

    //  createConversation(conversation: Conversation): Observable<any>{
    //      return this.http.post<any>(this.CONVERSATIONS_BASE_URL, conversation).pipe(
    //          catchError(error => {
    //              console.log(error)
    //              throw error;
    //          }),
    //          map((body: any) => {
    //              const newConversation: Conversation = body.data;
    //              this.conversations.set(newConversation.id, newConversation);
    //              this.subscribeConversationChannels(new Map([[newConversation.id, newConversation]]));
    //              ObserverUtil.notifyObservers(this.conversationsSubject, this.conversations);
    //          })
    //      );
    //  }

     createGroupConversation(conversation: Conversation): Observable<any>{
        return this.http.post<any>(this.GROUP_CONVERSATION_BASE_URL, conversation).pipe(
            catchError(error => {
                console.log(error)
                throw error;
            }),
            map((body: any) => {
                const newConversation: Conversation = body.data;
                 this.conversations.set(newConversation.id, newConversation);
                 this.subscribeConversationChannels(new Map([[newConversation.id, newConversation]]));
                 ObserverUtil.notifyObservers(this.conversationsSubject, this.conversations);;
            })
        );
    }
 
     updateConversation(conversation: Conversation): Observable<any> {
        console.log(conversation); 
        return this.http.put<any>(this.GROUP_CONVERSATION_BASE_URL, conversation).pipe(
             catchError(error => {
                 console.log(error)
                 throw error;
             }),
             map((body: any) => {
                if (!body.success) {
                    console.log(body.message);
                    return;
                }
                const conversation: Conversation = body.data as Conversation;
                this.conversations.set(conversation.id, conversation);
                ObserverUtil.notifyObservers(this.conversationsSubject, this.conversations);
             })
         );
     }
 
     deleteConversation(conversationId: number): Observable<any> {
         return this.http.delete<any>(`${this.CONVERSATIONS_BASE_URL}/${conversationId}`).pipe(
             catchError(error => {
                 console.log(error)
                 throw error;
             }),
             map((body: any) => {
                if (!body.success) {
                    console.log(body.message);
                    return;
                }

                this.conversations.delete(conversationId);
                this.unsubscribeConversationChannel(conversationId);
                ObserverUtil.notifyObservers(this.conversationsSubject, this.conversations);
             })
         );
     }
 
     joinGroupConversation(joinGroupConversationRequest: JoinGroupConversationRequest): Observable<any> {
         const URL = `${this.CONVERSATIONS_BASE_URL}/members`;
         return this.http.post<any>(URL, joinGroupConversationRequest).pipe(
             catchError(error => {
                 console.log(error)
                 throw error;
             }),
             map((body: any) => {
                if (!body.success) {
                    console.log(body.message);
                    return;
                }
                const joinedConversation: GroupConversation = body.data;
                this.conversations.set(joinedConversation.id, joinedConversation);
                this.subscribeConversationChannels(new Map([[joinedConversation.id, joinedConversation]]));
                ObserverUtil.notifyObservers(this.conversationsSubject, this.conversations);
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
                 console.log(error)
                 throw error;
             }),
             map((body: any) => {
                if (!body.success) {
                    console.log(body.message);
                    return;
                }
                 this.conversations.delete(leaveGroupConversationRequest.conversationId);
                 this.unsubscribeConversationChannel(leaveGroupConversationRequest.conversationId);
                 ObserverUtil.notifyObservers(this.conversationsSubject, this.conversations);
             })
         );
     }

     markAllMessagesAsRead(conversationId: number): void {
        this.stompService.publish(`/app/user/${SessionService.getCurrentUser().id}/conversation/${conversationId}/messageNotifications/markAllAsRead`);
     }

     subscribeMarkMessageAsRead(): void {
        const URL: string = `${WEB_SOCKET_PRIVATE_ENDPOINT}/user/${SessionService.getCurrentUser().id}/messageNotifications/markAsRead`;
        this.stompService.watch(URL, (res: any) => {
            if (!res.success){
                console.log(res.message);
                return;
            }
            const messageNotification: MessageNotification = res.data as MessageNotification;
            this.unreadMessages.delete(messageNotification.id);
            this.currentConversation.numberOfUnreadMessages = 0;
            this.conversations.get(this.currentConversation.id).numberOfUnreadMessages = 0;
            ObserverUtil.notifyObservers(this.unreadMessagesSubject, this.unreadMessages);
            ObserverUtil.notifyObservers(this.currentConversationSubject, this.currentConversation);
            ObserverUtil.notifyObservers(this.conversationsSubject, this.conversations);
        });
    }

    subscribeMarkAllMessagesAsRead(): void {
        const URL: string = `${WEB_SOCKET_PRIVATE_ENDPOINT}/user/${SessionService.getCurrentUser().id}/messageNotifications/markAllAsRead`;
        this.stompService.watch(URL, (res: any) => {
            if (!res.success){
                console.log(res.message);
                return;
            }
            console.log("ASD");
            this.unreadMessages.clear();
            this.currentConversation.numberOfUnreadMessages = 0;
            this.conversations.get(this.currentConversation.id).numberOfUnreadMessages = 0;
            ObserverUtil.notifyObservers(this.unreadMessagesSubject, this.unreadMessages);
            ObserverUtil.notifyObservers(this.currentConversationSubject, this.currentConversation);
            ObserverUtil.notifyObservers(this.conversationsSubject, this.conversations);
        });
    }
 
    subscribeConversationChannels(conversations: Map<number, Conversation>): void {
         conversations.forEach((value, key) => {
             const conversationKey: number = key;
             const URL: string = `${WEB_SOCKET_PUBLIC_ENDPOINT}/conversations/${conversationKey}/messages`;
             this.stompService.watch(URL, (res: any) => {

                if (!res.success){
                    console.log(res.message);
                }

                const receivedMessage: Message = res.data as Message;
                
                const foundConversation: Conversation = this.conversations.get(receivedMessage.conversationId);
                
                foundConversation.messages.push(receivedMessage);
                foundConversation.lastestMessage = receivedMessage;
                
                if (this.currentConversation && this.currentConversation.id == foundConversation.id) {
                    this.stompService.publish(`/app/user/${SessionService.getCurrentUser().id}/message/${receivedMessage.id}/messageNotifications/markAsRead`);
                    this.currentConversation = foundConversation;
                    ObserverUtil.notifyObservers(this.currentConversationSubject, this.currentConversation);
                }else {
                    foundConversation.numberOfUnreadMessages++;
                }
                this.conversations.set(foundConversation.id, foundConversation);
                ObserverUtil.notifyObservers(this.conversationsSubject, this.conversations);
             });
         });
     }
 
     unsubscribeConversationChannel(conversationId: number): void {
         const URL: string = `${WEB_SOCKET_PUBLIC_ENDPOINT}/conversations/${conversationId}/textMessages`;
         this.stompService.unwatch(URL, () => {
            console.log(`Unsubscribed from ${URL}`);
         });
     }
 
     sendTextMessageToChannel(conversation: Conversation, message: Message): void {
         const URL: string = `/app/conversations/${conversation.id}/textMessages`;
        this.stompService.publish(URL, message);
     }

     sendMultimediaMessageToChannel(conversation: Conversation, message: Message): void {
        const URL: string = `/app/conversations/${conversation.id}/multimediaMessages`;
        this.stompService.publish(URL, message);
    }
    
}
