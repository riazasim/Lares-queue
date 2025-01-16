import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Row } from 'read-excel-file';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { LocationService } from 'src/app/core/services/location.service';
import { OrganizationService } from 'src/app/core/services/organization.service';

import { handleError } from 'src/app/shared/utils/error-handling.function';
import { convertExcelRowToBasicLocation, generateBasicExcel, parseExcelFile } from 'src/app/shared/utils/excel.parser';
import {LocationModel} from "src/app/core/models/location.model";

@Component({
  selector: 'app-road-import-modal',
  templateUrl: './road-import-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoadImportModalComponent {
  @ViewChild('file') fileElement: ElementRef;
  @ViewChild('input') inputElement: ElementRef;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private readonly dialogRef: MatDialogRef<any>,
              private readonly locationService: LocationService,
              private readonly snackBar: MatSnackBar,
              private readonly translate: TranslateService,
              private readonly organizationService: OrganizationService,
              ) { }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.isLoading$.next(true);
    if (!this.fileElement.nativeElement.files.length) {
      this.isLoading$.next(false);
      return;
    }

    parseExcelFile(this.fileElement.nativeElement.files[0])
      .pipe(
        map(rowsWithHeader => rowsWithHeader.slice(1)),
        map(rows => rows.map(row => this.processParsing(row))),
        switchMap((locations: LocationModel[]) => this.locationService.importLocaitons(locations))
      ).subscribe({
        next: () => {
          this.snackBar.open('Imported!', 'Success', {
            duration: 3000,
            horizontalPosition: 'center',
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
          })
          this.dialogRef.close(true);
          this.isLoading$.next(false);
        },
        error: (body) => {
          handleError(this.snackBar, body, this.isLoading$);
        }
      })
  }

  private processParsing(row: Row) {
      return convertExcelRowToBasicLocation(row);
  }

  handleFileChange(): void {
    this.inputElement.nativeElement.value = this.fileElement.nativeElement.files[0].name
  }

  download(): void {
      this.isLoading$.next(true);
              generateBasicExcel(this.translate.currentLang).then((b: Blob) => {
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(b);
                  a.download = this.translate.currentLang ==='en' ? 'basic_EN.xlsx' : 'basic_RO.xlsx';
                  a.click();
                  URL.revokeObjectURL(a.href);
                  this.isLoading$.next(false);
              });

  }
}
