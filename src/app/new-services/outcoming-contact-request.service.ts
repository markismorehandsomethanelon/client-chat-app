import { Injectable } from "@angular/core";
import { API_BASE_URL, HEADER } from "../config";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { Contact } from "../models/contact";
import { User } from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class OutgoingContactRequestService {

    private OUTGOING_CONTACT_REQUESTS_BASE_URL: string = `${API_BASE_URL}/outgoingContactRequests`;

    private outgoingContactRequests: Contact[] = [];

    private outgoingContactRequestsSubject: Subject<Contact[]> = new Subject<Contact[]>();

    constructor(private http: HttpClient) {}

    findOutgoingContactRequests(user: User): Observable<any> {
        return this.http.get<any>(`${this.OUTGOING_CONTACT_REQUESTS_BASE_URL}/${user.id}`).pipe(
            catchError(error => {
                this.handleError(error);
                throw error;
            }),
            map((body: any) => {
                this.outgoingContactRequests = body.data;
                this.notifyObservers(this.outgoingContactRequestsSubject, this.outgoingContactRequests);
            })
        );
    }

    sendOutgoingContactRequests(contact: Contact): Observable<any> {
        return this.http.post<any>(`${this.OUTGOING_CONTACT_REQUESTS_BASE_URL}`, contact).pipe(
            catchError(error => {
                this.handleError(error);
                throw error;
            }),
            map((body: any) => {
                console.log(body);
                this.outgoingContactRequests.push(body.data);
                this.notifyObservers(this.outgoingContactRequestsSubject, this.outgoingContactRequests);
            })
        );
    }

    deleteOutgoingContactRequest(contact: Contact): Observable<any> {
        
        const OPTIONS = {
            headers: HEADER,
            body: contact
        };

        return this.http.delete<any>(`${this.OUTGOING_CONTACT_REQUESTS_BASE_URL}`, OPTIONS).pipe(
            catchError(error => {
                this.handleError(error);
                throw error;
            }),
            map((body: any) => {
                this.outgoingContactRequests = this.outgoingContactRequests.filter(currentContact => currentContact.id !== contact.id);
                this.notifyObservers(this.outgoingContactRequestsSubject, this.outgoingContactRequests);
            })
        );
    }

    onOutgoingContactRequestsChanged(): Observable<Contact[]> {
        return this.outgoingContactRequestsSubject.asObservable();
    }

    private handleError(error: any): void {
        console.error('Error:', error);
    }

    private notifyObservers(subject: Subject<any>, data: any): void {
        subject.next(data);
    }

}