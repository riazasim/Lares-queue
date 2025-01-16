import { Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})
export class ShowcaseComponent {
  contact: any | null;
  contactId: number | null = null;
  contactList: any;
  tabsData = [
    {
      tabName: "MOST PROBABLE SCENARIO",
      tabHeaders: {
        Headers: ["Most probable scenario"]
      }
    },
    {
      tabName: "WORST CASE SCENARIO",
      tabHeaders: {
        Headers: ["Worst case scenario"]
      }
    },
  
  ]
  constructor(
    private fb: UntypedFormBuilder,
  ) { }


}
