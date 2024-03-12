import { Injectable } from "@angular/core";
import { API_BASE_URL } from "../config";
import { HttpClient } from "@angular/common/http";
import { WebSocketService } from "../services/web-socket.service";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { User } from "../models/user";
import { catchError, map } from 'rxjs/operators';
import { Contact } from "../models/contact";

@Injectable({
    providedIn: 'root'
})
export class ContactRequestService {

    // urls
    private CONTACT_REQUESTS_BASE_URL: string = `${API_BASE_URL}/contactRequests`;

    private contactRequests: Contact[] = [];

    private contactRequestsSubject: Subject<Contact[]> = new Subject<Contact[]>();

    constructor(private http: HttpClient, private websocketService: WebSocketService, private router: Router) {
  
    }

    findContactRequest(user: User): Observable<any> {
        return this.http.get<any>(`${this.CONTACT_REQUESTS_BASE_URL}/${user.id}`).pipe(
            catchError(error => {
                this.handleError(error);
                throw error;
            }),
            map((body: any) => {
                this.contactRequests = body.data;
                this.notifyObservers(this.contactRequestsSubject, this.contactRequests);
            })
        );
    }

    sendRequest(contact: Contact): Observable<any> {
        return this.http.post<any>(`${this.CONTACT_REQUESTS_BASE_URL}`, contact).pipe(
            catchError(error => {
                this.handleError(error);
                throw error;
            }),
            map((body: any) => {
            })
        );
    }

    onContactRequestsChanged(): Observable<Contact[]> {
        return this.contactRequestsSubject.asObservable();
    }

    private handleError(error: any): void {
        console.error('Error:', error);
    }

    private notifyObservers(subject: Subject<any>, data: any): void {
        subject.next(data);
    }

}