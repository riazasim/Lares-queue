import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'no-convoy',
  templateUrl: './no-convoy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoConvoyComponent {
  @Input() userRole: any;
  @Input() transportMode: any;

  // For Debuging
  ngAfterContentInit(): void {
    console.log(this.userRole, this.transportMode)
  }
}
