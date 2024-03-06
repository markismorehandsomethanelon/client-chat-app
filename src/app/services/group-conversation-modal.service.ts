import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GroupConversationModalService {
    private modalRef: NgbModalRef;

    private closeModalSubject = new Subject<void>();

    closeModal$ = this.closeModalSubject.asObservable();

    constructor(private modalService: NgbModal) {}

    openModal(component: any, title: string): NgbModalRef {
        this.modalRef = this.modalService.open(component);
        this.modalRef.componentInstance.setTitle(title);
        return this.modalRef;
    }

    closeModal(): void {
        if (this.modalRef){
            this.modalRef.close();
            this.closeModalSubject.next();
        }
    }


}