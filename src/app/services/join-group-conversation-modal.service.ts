import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class JoinGroupConversationModalService {
    private modalRef: NgbModalRef;

    constructor(private modalService: NgbModal) {}

    openModal(component: any): NgbModalRef {
        this.modalRef = this.modalService.open(component);
        return this.modalRef;
    }

    closeModal(): void {
        if (this.modalRef){
            this.modalRef.close();
        }
    }

}