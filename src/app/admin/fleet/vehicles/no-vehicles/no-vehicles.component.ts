import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-no-vehicles',
  templateUrl: './no-vehicles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoVehiclesComponent {

}
