import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NGB_MODAL_OPTIONS } from "../config";

@Injectable({
    providedIn: 'root'
})
export class ConfirmModalService {
    private modalRef: NgbModalRef;

    private confirmActionCallback: Function;

    constructor(private modalService: NgbModal) {}

    openModal(component: any, content: string, confirmActionCallback: Function): NgbModalRef {
        this.modalRef = this.modalService.open(component, NGB_MODAL_OPTIONS);
        this.modalRef.componentInstance.setContent(content);
        this.confirmActionCallback = confirmActionCallback;
        return this.modalRef;
    }

    confirm(): void {
        this.confirmActionCallback();
    }

    closeModal(): void {
        if (this.modalRef){
            this.modalRef.close();
        }
    }

}