import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'full-empty-container',
  templateUrl: './full-empty-container.component.html',
  styleUrls: ['./full-empty-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullEmptyContainerComponent implements AfterViewInit {
  @Input() headerTitle: string = '';
  @Input() isCentered: boolean = true;
  classes: string[] = [];

  ngAfterViewInit(): void {
    if (this.isCentered) {
      this.classes.push('justify-center items-center')
    }
  }
}
