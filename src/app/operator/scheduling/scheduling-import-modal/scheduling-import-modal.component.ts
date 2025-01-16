import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Row } from 'read-excel-file';
import { BehaviorSubject, combineLatest, from, map, switchMap } from 'rxjs';
import { BookingModel } from 'src/app/core/models/booking.model';
import { DockService } from 'src/app/core/services/dock.service';
import { LocationService } from 'src/app/core/services/location.service';
import { OperationService } from 'src/app/core/services/operation.service';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { PartnerService } from 'src/app/core/services/partner.service';
import { PlanningService } from 'src/app/core/services/planning.service';
import { ProductService } from 'src/app/core/services/product.service';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { convertExcelRowToBasicPlanning, convertExcelRowToChimpexPlanning, convertExcelRowToComvexPlanning, convertExcelRowToUmexPlanning, generateBasicExcel, generateChimpexExcel, generateComvexExcel, generateUmexExcel, parseExcelFile } from 'src/app/shared/utils/excel.parser';
import { parseExcelToJson } from 'src/app/shared/utils/new.excel.parser';

@Component({
  selector: 'app-scheduling-import-modal',
  templateUrl: './scheduling-import-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulingImportModalComponent {
  @ViewChild('file') fileElement: ElementRef;
  @ViewChild('input') inputElement: ElementRef;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private readonly dialogRef: MatDialogRef<any>,
    private readonly planningService: PlanningService,
    private readonly snackBar: MatSnackBar,
    private readonly translate: TranslateService,
    private readonly dockService: DockService,
    private readonly operationService: OperationService,
    private readonly partnerService: PartnerService,
    private readonly productService: ProductService,
    private readonly organizationService: OrganizationService,
    private readonly locationService: LocationService) { }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.isLoading$.next(true);
    if (!this.fileElement.nativeElement.files.length) {
      this.isLoading$.next(false);
      return;
    }

    from(parseExcelToJson(this.fileElement.nativeElement.files[0])).subscribe((res: any) => {
      this.planningService.importPlannings(res).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (body) => {
          handleError(this.snackBar, body, this.isLoading$);
          this.dialogRef.close(true);
        }
      })
    })
    // parseExcelFile(this.fileElement.nativeElement.files[0])
    //   .pipe(
    //     map(rowsWithHeader => rowsWithHeader.slice(1)),
    //     map(rows => rows.map(row => this.processParsing(row))),
    //     switchMap((plannings: any[]) => this.planningService.importPlannings(plannings))
    //   ).subscribe({
    //     next: () => {
    //       this.snackBar.open('Imported!', 'Success', {
    //         duration: 3000,
    //         horizontalPosition: 'center',
    //         panelClass: ['success-snackbar'],
    //         verticalPosition: 'top', 
    //       })
    //       this.dialogRef.close(true);
    //       this.isLoading$.next(false);
    //     },
    //     error: (body) => {
    //       handleError(this.snackBar, body, this.isLoading$);
    //     }
    //   })
  }

  private processParsing(row: Row) {
    switch (true) {
      case this.organizationService.isComvexOrganization$.getValue(): return convertExcelRowToComvexPlanning(row); break;
      case this.organizationService.isUmexOrganization$.getValue(): return convertExcelRowToChimpexPlanning(row); break;
      case this.organizationService.isChimpexOrganization$.getValue(): return convertExcelRowToChimpexPlanning(row); break;
      default: return convertExcelRowToBasicPlanning(row); break;
    }
  }

  handleFileChange(): void {
    this.inputElement.nativeElement.value = this.fileElement.nativeElement.files[0].name
  }

  download(): void {
    switch (true) {
      // case this.organizationService.isComvexOrganization$.getValue(): this.downloadComvex() ;break; 
      // case this.organizationService.isUmexOrganization$.getValue(): this.downloadUmex(); break;
      case this.organizationService.isChimpexOrganization$.getValue(): this.downloadChimpex(); break;
      default: this.downloadBasic(); break;
    }
  }

  private downloadBasic(): void {
    this.isLoading$.next(true);
    combineLatest([
      this.operationService.list({}),
      this.dockService.list({})
    ]).subscribe({
      next: ([operations, docks]) => {
        generateBasicExcel(this.translate.currentLang).then((b: Blob) => {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(b);
          a.download = this.translate.currentLang === 'en' ? 'basic_EN.xlsx' : 'basic_RO.xlsx';
          a.click();
          URL.revokeObjectURL(a.href);
          this.isLoading$.next(false);
        });
      }, error: (body) => {
        handleError(this.snackBar, body, this.isLoading$);
      }
    })
  }

  // private downloadUmex(): void {
  //   this.isLoading$.next(true);
  //   combineLatest([
  //     this.operationService.list({}),
  //     this.dockService.list({}),
  //     this.partnerService.list({}),
  //     this.productService.list({})
  //   ]).subscribe({
  //     next: ([operations, docks, partners, products]) => {
  //     generateUmexExcel(this.translate.currentLang, operations, docks, partners, products).then((b: Blob) => {
  //       const a = document.createElement("a");
  //       a.href = URL.createObjectURL(b);
  //       a.download = this.translate.currentLang ==='en' ? 'umex_EN.xlsx' : 'umex_RO.xlsx';
  //       a.click();
  //       URL.revokeObjectURL(a.href);
  //       this.isLoading$.next(false);
  //     });
  //   }, error: (body) => {
  //     handleError(this.snackBar, body, this.isLoading$);
  //   }})
  // }

  // private downloadComvex(): void {
  //   this.isLoading$.next(true);
  //   combineLatest([
  //     this.operationService.list({}),
  //     this.dockService.list({}),
  //     this.partnerService.list({}),
  //     this.productService.list({}),
  //     this.locationService.listCountries()
  //   ]).subscribe({
  //     next: ([operations, docks, partners, products, countries]) => {
  //     generateComvexExcel(this.translate.currentLang, operations, docks, partners, products, countries).then((b: Blob) => {
  //       const a = document.createElement("a");
  //       a.href = URL.createObjectURL(b);
  //       a.download = this.translate.currentLang ==='en' ? 'comvex_EN.xlsx' : 'comvex_RO.xlsx';
  //       a.click();
  //       URL.revokeObjectURL(a.href);
  //       this.isLoading$.next(false);
  //     });
  //   }, error: (body) => {
  //     handleError(this.snackBar, body, this.isLoading$);
  //   }})
  // }

  private downloadChimpex(): void {
    this.isLoading$.next(true);
    combineLatest([
      this.operationService.list({}),
      this.dockService.list({}),
      this.productService.list({})
    ]).subscribe({
      next: ([operations, docks, products]) => {
        generateChimpexExcel(this.translate.currentLang, operations, docks, products).then((b: Blob) => {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(b);
          a.download = this.translate.currentLang === 'en' ? 'chimpex_EN.xlsx' : 'chimpex_RO.xlsx';
          a.click();
          URL.revokeObjectURL(a.href);
          this.isLoading$.next(false);
        });
      }, error: (body) => {
        handleError(this.snackBar, body, this.isLoading$);
      }
    })
  }

}
