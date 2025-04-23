import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, from } from 'rxjs';
import { generateTenantExcel } from 'src/app/shared/utils/excel.parser';
import { parseExcelToJson } from 'src/app/shared/utils/new.excel.parser';

@Component({
  selector: 'app-tenants-import-modal',
  templateUrl: './tenants-import-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantsImportModalComponent {
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
          type: "tenant",
          attributes: {
            name: item?.[0],
            maxQueueLength: item?.[1]?.toString(),
            initialQueueLength: item?.[2]?.toString(),
            hourlyProcessingSpeed: item?.[3]?.toString(),
            accessPoint: item?.[4]?.toString(),
            distanceToAccessPoint: item?.[5]?.toString(),
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
    generateTenantExcel(this.translate.currentLang).then((b: Blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = this.translate.currentLang === 'en' ? 'tenant_EN.xlsx' : 'tenant_RO.xlsx';
      a.click();
      URL.revokeObjectURL(a.href);
      this.isLoading$.next(false);
    });

  }
}
