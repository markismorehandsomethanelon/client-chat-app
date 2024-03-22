import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Injectable({
    providedIn: 'root'
})
export class GroupConversationModalService {
    private modalRef: NgbModalRef;

    constructor(private modalService: NgbModal) {}

    openModal(component: any, title: string, object: any, isUpdate: boolean): void {
        this.modalRef = this.modalService.open(component);
        this.modalRef.componentInstance.setTitle(title);
        this.modalRef.componentInstance.setObject(object);
        this.modalRef.componentInstance.setIsUpdate(isUpdate);
    }

    closeModal(): void {
        if (this.modalRef){
            this.modalRef.close();
        }
    }

}