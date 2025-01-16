import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SchedulingPreviewModel } from 'src/app/core/models/scheduling.model';

@Component({
  selector: 'scheduling-show-client-supplier-card-labels',
  templateUrl: './scheduling-show-client-supplier-card-labels.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulingShowClientSupplierCardLabelsComponent {
  @Input() planning: SchedulingPreviewModel;
  @Input() isUmexOrganization: boolean|null;
}
