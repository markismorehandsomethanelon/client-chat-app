import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { User } from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class UserProfileModalService {
    private modalRef: NgbModalRef;

    constructor(private modalService: NgbModal) {}

    openModal(component: any, editable: boolean, user: User, avatar: string): void {
        this.modalRef = this.modalService.open(component);
        this.modalRef.componentInstance.setEditable(editable);
        this.modalRef.componentInstance.setObject(user);
        this.modalRef.componentInstance.setAvatar(avatar);
    }
 
    closeModal(): void {
        if (this.modalRef){
            this.modalRef.close();
        }
    }
}