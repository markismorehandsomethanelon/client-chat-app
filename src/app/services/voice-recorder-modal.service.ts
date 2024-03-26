import { Injectable } from "@angular/core";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Injectable({
    providedIn: 'root'
})
export class VoiceRecorderModalService {
    private modalRef: NgbModalRef;

    constructor(private modalService: NgbModal) {}

    openModal(component: any): void {
        const NGB_MODAL_OPTIONS: NgbModalOptions = {
            backdrop : 'static',
            keyboard : false,
            centered: true,
            size: 'lg'
        };

        this.modalRef = this.modalService.open(component, NGB_MODAL_OPTIONS);
    }
 
    closeModal(): void {
        if (this.modalRef){
            this.modalRef.close();
        }
    }
}