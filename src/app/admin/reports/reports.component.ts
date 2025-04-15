import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
    constructor(
        private readonly parametersQueueService: ParametersQueueService,
        private readonly reportsService: ReportsService,
        private readonly snackBar: MatSnackBar,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) { }

    // downloadProbableQueueDetailCSV() {
    //     this.reportsService.probableQueueDetailCSV().subscribe({
    //       next: (blob: Blob) => {
    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.download = 'probable-scenario.csv';
    //         link.click();
    //         window.URL.revokeObjectURL(url);
    //       },
    //       error: (error) => {
    //         console.error('Failed to download CSV:', error);
    //       }
    //     });
    //   }
    // downloadInitialQueueDetailCSV() {
    //     return this.reportsService.initialQueueDetailCSV();
    // }

    initialQueueDetailCSV(event: MouseEvent): void {
        event.preventDefault();
      
        this.reportsService.initialQueueDetailCSV().subscribe({
          next: (blob: Blob) => {
            const csvBlob = new Blob([blob], { type: 'text/csv' });
            const url = window.URL.createObjectURL(csvBlob);
      
            // 👉 Open in a new tab
            window.open(url, '_blank');
      
            // 👉 Trigger file download
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'initial-queue-detail.csv';
            anchor.click();
      
            // 👉 Clean up
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
