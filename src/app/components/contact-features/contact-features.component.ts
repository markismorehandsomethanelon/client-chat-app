import { Component, OnInit } from '@angular/core';
import { AddContactModalService } from 'src/app/services/add-contact-modal.service';
import { AddContactModalComponent } from '../add-contact-modal/add-contact-modal.component';

@Component({
  selector: 'app-contact-features',
  templateUrl: './contact-features.component.html',
  styleUrls: ['./contact-features.component.css']
})
export class ContactFeaturesComponent implements OnInit {

  constructor(private addContactModalService: AddContactModalService) { }

  ngOnInit(): void {
  }

  openAddContactModal(): void {
    this.addContactModalService.openModal(AddContactModalComponent);
  }
}
