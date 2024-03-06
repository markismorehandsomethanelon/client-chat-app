import { Injectable } from '@angular/core';
import { Conversation } from '../models/conversation';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private userUrl = `${API_BASE_URL}/users`;

    constructor(private http: HttpClient) {

    }

    save(user: User): Observable<any> {
      return this.http.put(this.userUrl, user);
    }
  
}
