import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingService } from 'src/app/core/services/booking.service';
import { TenantsService } from 'src/app/core/services/tenants.service';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { BookingImportModalComponent } from './booking-import-modal/booking-import-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  @Output() nextTab = new EventEmitter<void>();
  bookingForm: FormGroup;
  pageSizeOptions = [5, 10, 15];
  pageIndex = 0;
  pageSize = 5;
  length = 0;
  tenants: any[] = [];
  timeSlotList: any[] = [];
  selectedTenant: any;
  timeSlotsHeader: string[] = Array.from({ length: 24 }, (_, i) =>
    `${i.toString().padStart(2, '0')}:00`
  );
  timeSlots: string[] = Array.from({ length: 24 }, (_, i) =>
    `${i.toString().padStart(2, '0')}:00`
  );
  constructor(
    private fb: FormBuilder,
    private readonly dialogService: MatDialog,
    private readonly tenantsService: TenantsService,
    private readonly bookingService: BookingService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      booking: this.fb.array([this.createBooking()]),
    });
    this.updateLength();
    // this.getTenantsList();
    // this.getTimeSlotList();
  }
  initData() {
    this.getTenantsList();
  }

  updateLength() {
    this.length = this.booking.length;
  }

  get booking(): FormArray {
    return this.bookingForm.get('booking') as FormArray;
  }

  getTenantsList() {
    this.tenantsService.getTenantsList().subscribe({
      next: (response) => {
        this.tenants = response;
        console.log('Tenants:', this.tenants);
      },
      error: (error) => console.error('Tenants:', error),
    });
  }

  onTenantSelectionChange(): void {
    const selectedTenants = this.booking.controls
      .map((group: any) => group.get('tenant')?.value)
      .filter((id: any) => id); // Remove empty values
    this.selectedTenant = this.tenants.filter(tenant => !selectedTenants.includes(tenant._id.toString()));
    this.booking.controls.forEach((group: any) => {
      const tenant = group.get('tenant')?.value;
      const selectedTenant = this.tenants.find(tenant => tenant._id.toString() === tenant);
      if (selectedTenant) {
        group.patchValue({ initialQueueLength: selectedTenant.initialQueueLength || 0 });
      }
    });

  }

  getBookingControl(group: any, slot: string): any {
    return group.get('bookings')?.get(slot);
  }

  createBooking(bookingData: any = null): FormGroup {
    const timeSlotControls = this.timeSlots.reduce<Record<string, any>>(
      (acc, timeSlot) => {
        acc[timeSlot] = bookingData ? bookingData.bookings[timeSlot] : 0;
        return acc;
      },
      {}
    );
    console.log(timeSlotControls);
    return this.fb.group({
      tenant: [bookingData ? bookingData.tenant : ''],
      initialQueueLength: [bookingData ? bookingData.initialQueueLength : 0],
      bookings: this.fb.group(timeSlotControls),
    });
  }

  addBooking(bookingData?: any): void {
    this.booking.push(this.createBooking(bookingData));
    this.updateLength();
  }

  removeBooking(index: number): void {
    if (this.booking.length > 1) {
      this.booking.removeAt(index);
      this.updateLength();
    }
  }

  openImportModal(): void {
    this.isLoading$.next(true);
    this.dialogService.open(BookingImportModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (response) => {
          if (response && response.data && response.data.items) {
            console.log(response.data.items)
            this.updateBookingForm(response.data.items);
          }
          this.isLoading$.next(false);
        },
        error: (error) => {
          console.error('Error during import:', error);
          handleError(this.snackBar, error);
          this.isLoading$.next(false);
        }
      });
  }

  updateBookingForm(importedBooking: any[]): void {
    const bookingArray = this.booking as FormArray;
    importedBooking.forEach((bookingItem) => {
      bookingArray.push(this.createBooking(bookingItem));
    });
    this.updateLength();
    this.cdr.markForCheck();
  }

  onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  next(): void {
    const bookingData = this.bookingForm.getRawValue().booking;
    const payload = {
      data: bookingData,
    };

    this.bookingService.create(payload).subscribe({
      next: () => {
        console.log('Payload created successfully:', payload);
        this.nextTab.emit();
      },
      error: (error: any) => {
        console.error('Error during creation:', error);
        handleError(this.snackBar, error);
      },
    });
  }
}
