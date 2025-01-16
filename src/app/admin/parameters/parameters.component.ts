import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent {
  contact: any | null;
  contactId: number | null = null;
  contactList: any;
  tabsData = [
    {
      tabName: "ACCESS POINTS",
      tabParagraph: "Make sure you set the values as close to your real life scenarios because the data represents the entry point for the simulation.",
      tabHeaders: {
        Headers: ["Access point name", "Processing speed for correct LPR (s)", "Wrong LPR readings (%)", "Processing speed for wrong LPR (s)"],
        Class: ["flex-[2]", "flex-1", "flex-1", "flex-1", "flex-[3]", "flex-1"]
      },
    },
    {
      tabName: "TENANTS",
      tabParagraph: "List all the tenants and their associated parameters.",
      tabHeaders: {
        Headers: ["Tenant", "Inside queue capacity", "Initial outside queue", "Hourly processing speed (maximum)", "Designated access point", "Gate-to-tenant time (min)"],
        Class: ["flex-[2]", "flex-1", "flex-1", "flex-1", "flex-[3]", "flex-1"]
      },
    },
    {
      tabName: "BOOKING",
      tabParagraph: "Bookings will be used as a parameter for the access validation process.",
      tabHeaders: {
        Headers: ["Tenant", "Initial Queue", "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",],
        Class: ["flex-[2]", "flex-1", "flex-1", "flex-1", "flex-[3]", "flex-1"]
      },
    },
    // {
    //   tabName: "QUEUE",
    //   tabParagraph: "List all the queues and their associated parameters.",
    //   tabHeaders: {
    //     Headers: ["Access point name", "Processing speed for correct LPR (s)", "Wrong LPR readings (%)", "Processing speed for wrong LPR (s)"],
    //     Class: ["flex-[2]", "flex-1", "flex-1", "flex-1", "flex-[3]"]
    //   },
    // },

  ]
  constructor(
    private fb: UntypedFormBuilder,
  ) { }


}
