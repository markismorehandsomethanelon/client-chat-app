import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ConfirmModalService {
    private modalRef: NgbModalRef;
    action: string;

    constructor(private modalService: NgbModal) {}

    openModal(component: any, action: string, data: any): NgbModalRef {
        this.modalRef = this.modalService.open(component);
        this.action = action;
        this.modalRef.componentInstance.setData(data);
        return this.modalRef;
    }

    closeModal(): void {
        if (this.modalRef){
            this.modalRef.close();
        }
    }

}