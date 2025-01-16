import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'no-restrictions',
  templateUrl: './no-restrictions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoRestrictionsComponent {
}