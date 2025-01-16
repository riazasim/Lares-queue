import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  contact: any | null;
  contactId: number | null = null;
  contactList: any;
  tabsData = [
    {
      tabName: "Container",
      tabImg: "assets/images/containerPb.svg",
      tabHeaders: {
        Headers: ["Wagons", "Brutto", "Tara", "Netto", "Seals", "U%", "Imp%", "Mh", "Ov"],
        Class: ["flex-[2]", "flex-1", "flex-1", "flex-1", "flex-[3]", "flex-1", "flex-1", "flex-1", "flex-1"]
      },
    },
    {
      tabName: "Liquids",
      tabImg: "assets/images/oilPb.svg",
      tabHeaders: {
        Headers: ["Wagons", "Brutto", "Tara", "Netto", "Seals", "U%", "Imp%", "Mh", "Ov"],
        Class: ["flex-[2]", "flex-1", "flex-1", "flex-1", "flex-[3]", "flex-1", "flex-1", "flex-1", "flex-1"]
      },
    },
    {
      tabName: "Grains",
      tabImg: "assets/images/cornPb.svg",
      tabHeaders: {
        Headers: ["Wagons", "Brutto", "Tara", "Netto", "Seals", "U%", "Imp%", "Mh", "Ov"],
        Class: ["flex-[2]", "flex-1", "flex-1", "flex-1", "flex-[3]", "flex-1", "flex-1", "flex-1", "flex-1"]
      },
    },
    {
      tabName: "Fertilizers",
      tabImg: "assets/images/fertilizerPb.svg",
      tabHeaders: {
        Headers: ["Wagons", "Brutto", "Tara", "Netto", "Seals", "U%", "Imp%", "Mh", "Ov"],
        Class: ["flex-[2]", "flex-1", "flex-1", "flex-1", "flex-[3]", "flex-1", "flex-1", "flex-1", "flex-1"]
      },
    },
    {
      tabName: "Cement",
      tabImg: "assets/images/cementPb.svg",
      tabHeaders: {
        Headers: ["Wagons", "Brutto", "Tara", "Netto", "Seals", "U%", "Imp%", "Mh", "Ov"],
        Class: ["flex-[2]", "flex-1", "flex-1", "flex-1", "flex-[3]", "flex-1", "flex-1", "flex-1", "flex-1"]
      },
    },
    {
      tabName: "Ore",
      tabImg: "assets/images/orePb.svg",
      tabHeaders: {
        Headers: ["Wagons", "Brutto", "Tara", "Netto", "Seals", "U%", "Imp%", "Mh", "Ov"],
        Class: ["flex-[2]", "flex-1", "flex-1", "flex-1", "flex-[3]", "flex-1", "flex-1", "flex-1", "flex-1"]
      },
    },
    {
      tabName: "Coal",
      tabImg: "assets/images/coalPb.svg",
      tabHeaders: {
        Headers: ["Wagons", "Brutto", "Tara", "Netto", "Seals", "U%", "Imp%", "Mh", "Ov"],
        Class: ["flex-[2]", "flex-1", "flex-1", "flex-1", "flex-[3]", "flex-1", "flex-1", "flex-1", "flex-1"]
      },
    },
    {
      tabName: "others",
      tabImg: "assets/images/othersPb.svg",
      tabHeaders: {
        Headers: ["Wagons", "Brutto", "Tara", "Netto", "Seals", "U%", "Imp%", "Mh", "Ov"],
        Class: ["flex-[2]", "flex-1", "flex-1", "flex-1", "flex-[3]", "flex-1", "flex-1", "flex-1", "flex-1"]
      },
    },
  ]
  constructor(
    private fb: UntypedFormBuilder,
  ) { }


}
