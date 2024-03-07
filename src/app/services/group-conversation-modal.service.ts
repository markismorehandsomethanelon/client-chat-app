import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { Conversation } from "../models/conversation";
import { GroupConversation } from "../models/group-conversation";

@Injectable({
    providedIn: 'root'
})
export class GroupConversationModalService {
    private modalRef: NgbModalRef;

    constructor(private modalService: NgbModal) {}

    openModal(component: any, title: string, object: any): void {
        this.modalRef = this.modalService.open(component);
        this.modalRef.componentInstance.setTitle(title);
        this.modalRef.componentInstance.setObject(object);
    }

    closeModal(): void {
        if (this.modalRef){
            this.modalRef.close();
        }
    }

}