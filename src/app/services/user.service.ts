import { Injectable } from '@angular/core';
import { Conversation } from '../models/conversation';
import { User } from '../models/user';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = `${API_BASE_URL}/users`;

  private currentUserSubject: Subject<User> = new Subject<User>();

  private currentUser?: User;

  constructor(private http: HttpClient) {

  }

  onCurrentUserChanged(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }

  save(user: User): Observable<any> {
    return this.http.put(this.userUrl, user).pipe(
      catchError(error => {
        console.log(error);
          throw error;
      }),
      map((body: any) => {
          this.currentUser = body.data;
          this.notifyObservers(this.currentUserSubject, this.currentUser);
      })
    );
  }

  findUser(userId: number): Observable<any> {
    return this.http.get(`${this.userUrl}/${userId}`);
  }

  private notifyObservers(subject: Subject<any>, data: any): void {
    subject.next(data);
  }
  
}
