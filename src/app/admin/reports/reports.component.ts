import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NativeResponseWrapper } from 'src/app/core/models/response-wrappers.types';
import { ParametersQueueService } from 'src/app/core/services/parameters-queue.service';
import { ReportsService } from 'src/app/core/services/reports.service';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor(
        private readonly parametersQueueService: ParametersQueueService,
        private readonly reportsService: ReportsService,
        private readonly snackBar: MatSnackBar,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) { }

    probabaleTransactions(event: MouseEvent): void {
        event.preventDefault();
      
        this.reportsService.probabaleTransactions().subscribe({
          next: (blob: Blob) => {
            const csvBlob = new Blob([blob], { type: 'text/csv' });
            const url = window.URL.createObjectURL(csvBlob);
      
            // ✅ Just trigger file download
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'Probabale scenario transactions.csv';
            anchor.click();
      
            // ✅ Clean up
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          },
          error: (err) => {
            console.error('CSV download failed:', err);
          }
        });
      }

      worstTransactions(event: MouseEvent): void {
        event.preventDefault();
      
        this.reportsService.worstTransactions().subscribe({
          next: (blob: Blob) => {
            const csvBlob = new Blob([blob], { type: 'text/csv' });
            const url = window.URL.createObjectURL(csvBlob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'Worst case scenario transactions.csv';
            anchor.click();
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          },
          error: (err) => {
            console.error('CSV download failed:', err);
          }
        });
      }

    probabaleQueue(event: MouseEvent): void {
        event.preventDefault();
      
        this.reportsService.probabaleQueue().subscribe({
          next: (blob: Blob) => {
            const csvBlob = new Blob([blob], { type: 'text/csv' });
            const url = window.URL.createObjectURL(csvBlob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'Probabale scenario queue.csv';
            anchor.click();
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          },
          error: (err) => {
            console.error('CSV download failed:', err);
          }
        });
      }

    worstQueue(event: MouseEvent): void {
        event.preventDefault();
      
        this.reportsService.worstQueue().subscribe({
          next: (blob: Blob) => {
            const csvBlob = new Blob([blob], { type: 'text/csv' });
            const url = window.URL.createObjectURL(csvBlob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'Worst case scenario queue.csv';
            anchor.click();
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          },
          error: (err) => {
            console.error('CSV download failed:', err);
          }
        });
      }

    handleError(body: NativeResponseWrapper<any>): void {
        if (body.code === 400) {
            for (let prop in body.error.form) {
                this.snackBar.open('Error!', (<any>body.error.form)[prop], {
                    duration: 3000,
                    horizontalPosition: 'end',
                    panelClass: ['error-snackbar'],
                    verticalPosition: 'bottom',
                })
            }
        } else {
            this.snackBar.open('Error!', body.error.detail, {
                duration: 3000,
                horizontalPosition: 'end',
                panelClass: ['error-snackbar'],
                verticalPosition: 'bottom',
            })
        }
    }

    startAgain() {
        // this.deleteQueue().subscribe({

        // this.router.navigate(['../home'], { relativeTo: this.route, queryParams: { finish: true } });
        this.parametersQueueService.deleteQueue().subscribe({
            next: () => {
                this.router.navigate(['../home'], { relativeTo: this.route, queryParams: { finish: true } });
            },
            error: (error) => {
                this.handleError(error);
            }
        });
    }
    finish() {
        this.parametersQueueService.deleteQueue().subscribe({
            next: () => {
                this.router.navigate(['../home'], { relativeTo: this.route, queryParams: { finish: true } });
            },
            error: (error) => {
                this.handleError(error);
            }
        });
    }

}
