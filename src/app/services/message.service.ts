import { Injectable } from "@angular/core";
import { API_BASE_URL } from "../config";



@Injectable({
    providedIn: 'root'
  })
  export class MessageService {
  
    private userUrl: string = `${API_BASE_URL}/users`;

    // private const WEB_SOCKET_MESSAGE_URL = `/app/public/conversation/$}/messages`;

    // constructor(private http: HttpClient) {

    // }

    // save(user: User): Observable<any> {
    // return this.http.put(this.userUrl, user);
    // }
    
  }
  