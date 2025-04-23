import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ParametersQueueService } from 'src/app/core/services/parameters-queue.service';

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

    async next() {
        this.isLoading$.next(true);
        try {
            this.router.navigate(['../simulation/filter'], { relativeTo: this.route });
        } catch (error) {
            console.error("Error in generateQueue:", error);
        } finally {
            this.isLoading$.next(false);
        }
    }

}
