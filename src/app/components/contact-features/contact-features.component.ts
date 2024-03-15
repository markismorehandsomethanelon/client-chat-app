import { Component, OnInit } from '@angular/core';
import { FindContactModalService } from 'src/app/services/find-contact-modal.service';
import { FindContactModelComponent } from '../find-contact-modal/find-contact-modal.component';

@Component({
  selector: 'app-contact-features',
  templateUrl: './contact-features.component.html',
  styleUrls: ['./contact-features.component.css']
})
export class ContactFeaturesComponent implements OnInit {

  constructor(private addContactModalService: FindContactModalService) { }

  ngOnInit(): void {
  }

  openFindContactModal(): void {
    this.addContactModalService.openModal(FindContactModelComponent);
  }
}
