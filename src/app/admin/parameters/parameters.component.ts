import { Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantsComponent } from './tenants/tenants.component';
import { BookingComponent } from './booking/booking.component';
import { ParametersQueueComponent } from './parameters-queue/parameters-queue.component';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent {
  @ViewChild(TenantsComponent) tenantsComponent: TenantsComponent;
  @ViewChild(BookingComponent) bookingComponent: BookingComponent;
  @ViewChild(ParametersQueueComponent) parametersQueueComponent: ParametersQueueComponent;
  selectedIndex = 0;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) { }

  nextTab() {
    if (this.selectedIndex < 3) {
      this.selectedIndex++;
    } else {
      this.router.navigate(['../queue'], { relativeTo: this.route });
    }
  }

  onTabChange(index: number) {
    this.selectedIndex = index;
    // Call the appropriate API load function based on the current tab
    switch (index) {
      case 0:
        // Emit event or call function to load data for Access Points
        break;
      case 1:
        this.tenantsComponent?.initData();
        break;
      case 2:
        this.bookingComponent?.initData();
        break;
      case 3:
        this.parametersQueueComponent?.initData();
        break;
    }
  }

}
