import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-message-automations-list',
  templateUrl: './message-automations-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageAutomationsListComponent {
  loading: boolean = false;
  displayedColumns = ['operation', 'trigger', 'scheduling', 'status'];
  dataSource = [{
    operation: 'Unloading 20 tones truck',
    trigger: 'Order created',
    scheduling: '00:00',
    status: 'Assign'
  }]
  constructor(private readonly dialogService: MatDialog,
    private readonly router: Router,
              private readonly route: ActivatedRoute) { }

  openDeleteModal() { }

  redirectAddMessage(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }

}
