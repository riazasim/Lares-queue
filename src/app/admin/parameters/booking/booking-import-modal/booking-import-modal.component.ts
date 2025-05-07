import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, from } from 'rxjs';
import { generateBookingExcel } from 'src/app/shared/utils/excel.parser';
import { parseExcelToJson } from 'src/app/shared/utils/new.excel.parser';

@Component({
  selector: 'app-booking-import-modal',
  templateUrl: './booking-import-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingImportModalComponent {
  @ViewChild('file') fileElement: ElementRef;
  @ViewChild('input') inputElement: ElementRef;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private readonly dialogRef: MatDialogRef<any>,
    private readonly translate: TranslateService,
  ) { }

  cancel(): void {
    this.dialogRef.close(false);
  }

  convertArrayToJSON(input: any[][]): any {
    const output = {
      data: {
        type: "list",
        items: input.map(item => ({
          tenant: item[0].toString(),
          initialQueueLength: item[1] || 0,
          bookings: {
            "00:00": item[2] || 0,
            "01:00": item[3] || 0,
            "02:00": item[4] || 0,
            "03:00": item[5] || 0,
            "04:00": item[6] || 0,
            "05:00": item[7] || 0,
            "06:00": item[8] || 0,
            "07:00": item[9] || 0,
            "08:00": item[10] || 0,
            "09:00": item[11] || 0,
            "10:00": item[12] || 0,
            "11:00": item[13] || 0,
            "12:00": item[14] || 0,
            "13:00": item[15] || 0,
            "14:00": item[16] || 0,
            "15:00": item[17] || 0,
            "16:00": item[18] || 0,
            "17:00": item[19] || 0,
            "18:00": item[20] || 0,
            "19:00": item[21] || 0,
            "20:00": item[22] || 0,
            "21:00": item[23] || 0,
            "22:00": item[24] || 0,
            "23:00": item[25] || 0,
          }
        }))
      }
    };

    return output;
  }

  confirm(): void {
    this.isLoading$.next(true);
    if (!this.fileElement.nativeElement.files.length) {
      this.isLoading$.next(false);
      return;
    }

    from(parseExcelToJson(this.fileElement.nativeElement.files[0])).subscribe((res: any) => {
      const payload = this.convertArrayToJSON(res.slice(1));
      this.dialogRef.close(payload);
      this.isLoading$.next(false);
    });
  }

  handleFileChange(): void {
    this.inputElement.nativeElement.value = this.fileElement.nativeElement.files[0].name
  }

  download(): void {
    this.isLoading$.next(true);
    generateBookingExcel(this.translate.currentLang).then((b: Blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = this.translate.currentLang === 'en' ? 'booking_EN.xlsx' : 'booking_RO.xlsx';
      a.click();
      URL.revokeObjectURL(a.href);
      this.isLoading$.next(false);
    });

  }
}
