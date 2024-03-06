import { Injectable } from '@angular/core';
import { Conversation } from '../models/conversation';
import { Message } from '../models/message';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

//   conversations: Conversation[] = [
//     { 
//         id: 1,
//         lastestMessage: new Message(1, new User(1, 'Alice'), 'This is content 1', "01-03-24 10:00:00"),
//         messages: [
//           new Message(1, new User(1, 'Alice'), 'This is content 1', '2002')
//         ]       
//       },
//       { 
//         id: 2,
//         lastestMessage: new Message(2, new User(2, 'Bob'), 'This is content 2', "01-03-24 10:05:00"),
//         messages: [
//           new Message(1, new User(1, 'Alice'), 'This is content 1', '2002'),
//           new Message(1, new User(2, 'Bob'), 'This is content 10', '2002')
//         ]   
//       },
//       { 
//         id: 3,
//         lastestMessage: new Message(3, new User(1, 'Alice'), 'This is content 3', "01-03-24 10:10:00"),
//         messages: [
//           new Message(1, new User(1, 'Alice'), 'This is content 1', '2002')
//         ]   
//       },
//       { 
//         id: 4,
//         lastestMessage: new Message(4, new User(2, 'Bob'), 'This is content 4', "01-03-24 10:15:00"),
//         messages: [
//           new Message(1, new User(1, 'Alice'), 'This is content 1', '2002'),
//           new Message(1, new User(2, 'Bob'), 'This is content 10', '2002')
//         ]   
//       },
//       { 
//         id: 5,
//         lastestMessage: new Message(5, new User(2, 'Bob'), 'This is content 5', "01-03-24 10:15:00"),
//         messages: [
//           new Message(1, new User(1, 'Alice'), 'This is content 1', '2002'),
//           new Message(1, new User(2, 'Bob'), 'This is content 10', '2002')
//         ]   
//       }
// ];

  constructor() {

  }

  findAll(): Observable<Conversation[]> {
      // return of(this.conversations);
      return of();
    }

  findById(id: number): Observable<Conversation> {
    // return of(this.conversations.find(item => item.id == id));
    return of();
  }

  save(conversation: Conversation): void {
    // this.conversations.push(conversation);
  }
  
}
