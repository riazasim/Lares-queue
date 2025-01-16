import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent {
  isSelectedTenant$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  tenants = [
    { id: 1, name: 'Tenant 1' },
    { id: 2, name: 'Tenant 2' },
    { id: 3, name: 'Tenant 3' },
  ];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) { }

  selectTenant(value: string) {
    this.isSelectedTenant$.next(value === 'Select Tenant');
  }

  next() {
    this.router.navigate(['../showcase'], { relativeTo: this.route });
  }
}
