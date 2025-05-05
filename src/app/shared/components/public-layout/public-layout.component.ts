import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: '[app-public-layout]',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicLayoutComponent {
  @Input()
  public decorationMaxWidth: string | undefined = '775px';
  @Input()
  public contentMaxWidth: string | undefined = 'unset';
  @Input()
  public decorationMinWidth: string | undefined = '600px';

}
