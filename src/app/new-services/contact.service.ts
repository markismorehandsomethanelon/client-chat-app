import { Injectable } from "@angular/core";
import { API_BASE_URL, HEADER } from "../config";
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
export class ContactService {

    // urls
    private CONTACTS_BASE_URL: string = `${API_BASE_URL}/contacts`;
    

    private contacts: Contact[] = [];

    private contactsSubject: Subject<Contact[]> = new Subject<Contact[]>();
    

    constructor(private http: HttpClient, private websocketService: WebSocketService, private router: Router) {
  
    }

    findContacts(user: User): Observable<any> {
        return this.http.get<any>(`${this.CONTACTS_BASE_URL}/${user.id}`).pipe(
            catchError(error => {
                this.handleError(error);
                throw error;
            }),
            map((body: any) => {
                this.contacts = body.data;
                this.notifyObservers(this.contactsSubject, this.contacts);
            })
        );
    }

    deleteContact(contact: Contact): Observable<any> {
        const OPTIONS = {
            headers: HEADER,
            body: contact
        };
        
        console.log(this);

        return this.http.delete<any>(`${this.CONTACTS_BASE_URL}`, OPTIONS).pipe(
            catchError(error => {
                this.handleError(error);
                throw error;
            }),
            map((body: any) => {
                this.contacts = this.contacts.filter(currentContact => contact.id !== currentContact.id);
                this.notifyObservers(this.contactsSubject, this.contacts);
            })
        );
    }


    onContactsChanged(): Observable<Contact[]> {
        return this.contactsSubject.asObservable();
    }

    private handleError(error: any): void {
        console.error('Error:', error);
    }

    private notifyObservers(subject: Subject<any>, data: any): void {
        subject.next(data);
    }
}