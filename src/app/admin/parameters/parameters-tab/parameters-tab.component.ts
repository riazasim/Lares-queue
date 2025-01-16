import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-parameters-tab',
  templateUrl: './parameters-tab.component.html',
  styleUrls: ['./parameters-tab.component.scss']
})
export class ParametersTabsComponent {
  contact: any | null;
  contactId: number | null = null;
  contactList: any;
  rowIndex: number = 1;
  rows : number[] = [1];
  @Input() Headers: any[] = [];
  @Input() Classes: any[] = [];
  constructor(
    private readonly router: Router,
            private readonly route: ActivatedRoute,
  ) { }

  addRow(): void {
    this.rows.push(this.rows.length + 1);
  }

  removeRow(index: number) {
    if (this.rows.length > 1) {
        this.rows.splice(index, 1);
    this.rows = this.rows.map((_, i) => i + 1);
    }
}

next(){
  this.router.navigate(['../queue'], { relativeTo: this.route });
}

}
