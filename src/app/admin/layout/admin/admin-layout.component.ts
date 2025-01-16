import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: '[admin-layout], [adminLayout]',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  @Input()
  public version: 'legacy' | 'latest' = 'latest';
}
