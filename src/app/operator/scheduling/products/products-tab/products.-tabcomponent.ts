import { Component, Inject, Input } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-products-tab',
  templateUrl: './products-tab.component.html',
  styleUrls: ['./products-tab.component.scss']
})
export class ProductsTabsComponent {
  contact: any | null;
  contactId: number | null = null;
  contactList: any;
  rowIndex: number = 1;
  rows : any[] = [this.rowIndex];
  @Input() Headers: any[] = [];
  @Input() Classes: any[] = [];
  constructor(
    private fb: UntypedFormBuilder,
  ) { }
  // get contacts(): any {
  // return this.companyForm.get('contacts');
  // }

  addContact(): void {
    this.rows.push(++this.rowIndex);
  }

  removeContact(): void {
    // const companyId = this.company$?.value?.id;
    // const contactsArray = this.company$?.value?.contacts;

    // if (companyId && contactsArray && contactsArray.length > 0) {
    //   const contactId = contactsArray[index]?.id;
    //   if (contactId !== null && contactId !== undefined && contactId > -1) {
    //     this.companyService.deleteContact(companyId, contactId).subscribe({
    //       next: () => {
    //         console.log('Contact deleted successfully');
    //         this.contacts.removeAt(index);
    //         this.cd.detectChanges();
    //         return this.companyForm.get('contacts');
    //       },
    //       error: error => {
    //         console.error('Error deleting contact:', error);
    //       }
    //     });
    //   }
    // } else {
    // this.contacts.removeAt(index);
    // }
  }

}
