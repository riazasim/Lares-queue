import { Component, Input } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ShipmentLogsModel } from 'src/app/core/models/scheduling.model';

@Component({
  selector: 'activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent {
  @Input() shipmentLog: ShipmentLogsModel;

  @Input() isEnd: boolean;

  @Input() icon: IconProp | undefined;
}
