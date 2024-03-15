import { Injectable } from "@angular/core";
import { API_BASE_URL } from "../config";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { User } from "../models/user";
import { catchError, map } from 'rxjs/operators';
import { Contact } from "../models/contact";

@Injectable({
    providedIn: 'root'
})
export class IncomingContactRequestService {

    // urls
    private INCOMING_CONTACT_REQUESTS_BASE_URL: string = `${API_BASE_URL}/incomingContactRequests`;

    private incomingContactRequests: Contact[] = [];

    private incomingContactRequestsSubject: Subject<Contact[]> = new Subject<Contact[]>();

    constructor(private http: HttpClient) {
  
    }

    findContactRequest(user: User): Observable<any> {
        return this.http.get<any>(`${this.INCOMING_CONTACT_REQUESTS_BASE_URL}/${user.id}`).pipe(
            catchError(error => {
                this.handleError(error);
                throw error;
            }),
            map((body: any) => {
                this.incomingContactRequests = body.data;
                this.notifyObservers(this.incomingContactRequestsSubject, this.incomingContactRequests);
            })
        );
    }

    acceptRequest(contact: Contact): Observable<any> {
        return this.http.put<any>(`${this.INCOMING_CONTACT_REQUESTS_BASE_URL}`, contact).pipe(
            catchError(error => {
                this.handleError(error);
                throw error;
            }),
            map((body: any) => {
                this.incomingContactRequests = this.incomingContactRequests.filter(currentContact => currentContact.id !== contact.id);
                this.notifyObservers(this.incomingContactRequestsSubject, this.incomingContactRequests);
            })
        );
    }

    declineRequest(contact: Contact): Observable<any> {
        const OPTIONS = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            body: contact
        };

        return this.http.delete<any>(`${this.INCOMING_CONTACT_REQUESTS_BASE_URL}`, OPTIONS).pipe(
            catchError(error => {
                this.handleError(error);
                throw error;
            }),
            map((body: any) => {
                this.incomingContactRequests = this.incomingContactRequests.filter(currentContact => currentContact.id !== contact.id);
                this.notifyObservers(this.incomingContactRequestsSubject, this.incomingContactRequests);
            })
        );
    }

    onIncomingContactRequestsChanged(): Observable<Contact[]> {
        return this.incomingContactRequestsSubject.asObservable();
    }

    private handleError(error: any): void {
        console.error('Error:', error);
    }

    private notifyObservers(subject: Subject<any>, data: any): void {
        subject.next(data);
    }

}