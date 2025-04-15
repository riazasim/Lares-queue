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
          type: "booking",
          attributes: {
            parameterTenantId: item[0].toString(),
            initialQueue: item[1] || 0,
            timeSlot1: item[2] || 0,
            timeSlot2: item[3] || 0,
            timeSlot3: item[4] || 0,
            timeSlot4: item[5] || 0,
            timeSlot5: item[6] || 0,
            timeSlot6: item[7] || 0,
            timeSlot7: item[8] || 0,
            timeSlot8: item[9] || 0,
            timeSlot9: item[10] || 0,
            timeSlot10: item[11] || 0,
            timeSlot11: item[12] || 0,
            timeSlot12: item[13] || 0,
            timeSlot13: item[14] || 0,
            timeSlot14: item[15] || 0,
            timeSlot15: item[16] || 0,
            timeSlot16: item[17] || 0,
            timeSlot17: item[18] || 0,
            timeSlot18: item[19] || 0,
            timeSlot19: item[20] || 0,
            timeSlot20: item[21] || 0,
            timeSlot21: item[22] || 0,
            timeSlot22: item[23] || 0,
            timeSlot23: item[24] || 0,
            timeSlot24: item[25] || 0,
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
