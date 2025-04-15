import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ParametersQueueService } from 'src/app/core/services/parameters-queue.service';
import { QueueService } from 'src/app/core/services/queue.service';

@Component({
    selector: 'app-queue',
    templateUrl: './queue.component.html',
    styleUrls: ['./queue.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueueComponent {
    queues$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    mode: ProgressBarMode = 'determinate';
    bufferValue = 75;
    constructor(
        private readonly queueService: QueueService,
        private parametersQueueService: ParametersQueueService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) { this.getParameterQueueSetting() }

    getParameterQueueSetting() {
        this.parametersQueueService.getParameterQueueSetting().subscribe({
            next: (response) => {
                this.queues$.next(response);
                console.log('Queues:', this.queues$);
            },
            error: (error) => console.error('Failed to queues:', error)
        });
    }

    async generateQueue(): Promise<void> {
        this.isLoading$.next(true);
        return new Promise((resolve, reject) => {
            this.queueService.generateQueue().subscribe({
                next: (res) => {
                    console.log('Queue generated successfully:', res);
                    resolve();
                },
                error: (err) => {
                    console.error('Queue error:', err);
                    reject(err);
                }
            });
        });
    }
    
    async next() {
        this.isLoading$.next(true);
        
        try {
            await this.generateQueue(); // This now correctly waits for completion
            this.router.navigate(['../simulation/filter'], { relativeTo: this.route });
        } catch (error) {
            console.error("Error in generateQueue:", error);
        } finally {
            this.isLoading$.next(false);
        }
    }

}
