import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: 'app-add-fleet',
    templateUrl: './add-fleet.component.html',
    styleUrls: ['./add-fleet.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class AddFleetComponent {
  constructor() {}

   ngOnInit(): void {
  }

  }