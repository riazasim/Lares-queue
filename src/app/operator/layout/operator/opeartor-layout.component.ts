// import { A11yModule } from '@angular/cdk/a11y';
// import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';

@Component({
  selector: '[operator-layout], [operatorLayout]',
  templateUrl: './operator-layout.component.html',
  styleUrls: ['./operator-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorLayoutComponent {
  @Input()
  public version: 'legacy' | 'latest' = 'latest';
}
