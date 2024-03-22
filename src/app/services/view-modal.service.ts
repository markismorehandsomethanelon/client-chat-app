import { Injectable } from "@angular/core";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Injectable({
    providedIn: 'root'
})
export class ViewModalService {
    private modalRef: NgbModalRef;

    constructor(private modalService: NgbModal) {}

    openModal(component: any, data: any): void {
        const NGB_MODAL_OPTIONS: NgbModalOptions = {
            size: 'fullscreen',
            backdrop : 'static',
            keyboard : false,
        };

        this.modalRef = this.modalService.open(component, NGB_MODAL_OPTIONS);
        this.modalRef.componentInstance.setData(data);
    }
 
    closeModal(): void {
        if (this.modalRef){
            this.modalRef.close();
        }
    }
}