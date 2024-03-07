import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { Account } from "../models/account";
import { ChangePasswordRequest } from "../requests/change-password.request";

@Injectable({
    providedIn: 'root'
})
export class ChangePasswordModalService {
    private modalRef: NgbModalRef;

    private closeModalSubject = new Subject<void>();
    private saveModelSubject = new Subject<ChangePasswordRequest>();

    closeModal$ = this.closeModalSubject.asObservable();
    saveModal$ = this.saveModelSubject.asObservable();

    constructor(private modalService: NgbModal) {}

    openModal(component: any): void {
        this.modalRef = this.modalService.open(component);
    }
    
    saveModal(request: ChangePasswordRequest){
        if (this.modalRef){
            this.saveModelSubject.next(request);
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