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
  timeSlots: string[] = Array.from({ length: 24 }, (_, i) => `timeSlot${i + 1}`);

  constructor(
    private fb: FormBuilder,
    private readonly dialogService: MatDialog,
    private readonly tenantsService: TenantsService,
    private readonly bookingService: BookingService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

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
    this.getTimeSlotList();
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
        this.tenants = response.map((item: any) => item.attributes);
        console.log('Tenants:', this.tenants);
      },
      error: (error) => console.error('Tenants:', error),
    });
  }
  getTimeSlotList() {
    this.bookingService.getTimeSlotList().subscribe({
      next: (response) => {
        this.timeSlotList = response.map((item: any) => item.attributes);
        console.log('Time Slot List:', this.timeSlotList);
      },
      error: (error) => console.error('Time Slot List:', error),
    });
  }

  onTenantSelectionChange(): void {
    // const selectedTenantIds = this.bookingForm
    //   .get('booking')
    //   ?.value.map((row: any) => row.parameterTenantId);
    // this.selectedTenant = selectedTenantIds.filter((id: any) => id);
    const selectedTenantIds = this.booking.controls
    .map((group: any) => group.get('parameterTenantId')?.value)
    .filter((id: any) => id); // Remove empty values

  console.log('Selected Tenant IDs:', selectedTenantIds);
  console.log('Available Tenants:', this.tenants);

  // Update tenant list by filtering out selected ones
  this.selectedTenant = this.tenants.filter(tenant => !selectedTenantIds.includes(tenant.id.toString()));

  // Auto-fill initialQueue for selected tenant
  this.booking.controls.forEach((group: any) => {
    const tenantId = group.get('parameterTenantId')?.value;
    const selectedTenant = this.tenants.find(tenant => tenant.id.toString() === tenantId);

    console.log('Selected Tenant:', selectedTenant);

    if (selectedTenant) {
      group.patchValue({ initialQueue: selectedTenant.initialInsideQueue || 0 });
    }
  });
  
  }

  createBooking(bookingData: any = null): FormGroup {
    const timeSlotControls = this.timeSlots.reduce<Record<string, any>>(
      (acc, timeSlot) => {
        acc[timeSlot] = [bookingData ? bookingData.attributes[timeSlot] : 0];
        return acc;
      },
      {}
    );
  
    return this.fb.group({
      parameterTenantId: [bookingData ? bookingData.attributes.parameterTenantId : ''],
      initialQueue: [bookingData ? bookingData.attributes.initialQueue : 0],
      ...timeSlotControls,
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
        if (bookingItem.type === "booking") {
          bookingArray.push(this.createBooking(bookingItem));
        }
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
      queue: {
        parameterBookings: bookingData,
      },
    };

    this.bookingService.create(payload).subscribe({
      next: () => {
        this.nextTab.emit();
        console.log('Payload created successfully:', payload);
      },
      error: (error: any) => {
        console.error('Error during creation:', error);
        handleError(this.snackBar, error);
      },
    });
   }
}
