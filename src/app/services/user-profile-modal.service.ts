import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { User } from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class UserProfileModalService {
    private modalRef: NgbModalRef;

    private closeModalSubject = new Subject<void>();
    private saveModelSubject = new Subject<User>();

    closeModal$ = this.closeModalSubject.asObservable();
    saveModal$ = this.saveModelSubject.asObservable();

    constructor(private modalService: NgbModal) {}

    openModal(component: any, editable: boolean, user: User): void {
        this.modalRef = this.modalService.open(component);
        this.modalRef.componentInstance.setEditable(editable);
        this.modalRef.componentInstance.setObject(user);
    }
    
    saveModal(user: User){
        if (this.modalRef){
            this.saveModelSubject.next(user);
        }
    }
    

    closeModal(): void {
        if (this.modalRef){
            this.modalRef.close();
            this.closeModalSubject.next();
        }
    }

    showMessage(message: String): void {
        if (this.modalRef){
            this.modalRef.componentInstance.showMessage(message);
        } 
    }
}