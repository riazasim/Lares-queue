import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueueComponent {

  mode: ProgressBarMode = 'determinate';
  value = 70;
  bufferValue = 75;
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) { }

  next() {
    this.router.navigate(['../simulation/filter'], { relativeTo: this.route });
  }

}
