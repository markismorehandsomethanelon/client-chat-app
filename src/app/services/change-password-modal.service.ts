import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { Account } from "../models/account";
import { ChangePasswordRequest } from "../requests/change-password.request";
import { NGB_MODAL_OPTIONS } from "../config";

@Injectable({
    providedIn: 'root'
})
export class ChangePasswordModalService {
    private modalRef: NgbModalRef;

    constructor(private modalService: NgbModal) {}

    openModal(component: any): void {
        this.modalRef = this.modalService.open(component, NGB_MODAL_OPTIONS);
    }
    
    closeModal(): void {
        if (this.modalRef){
            this.modalRef.close();
        }
    }

}