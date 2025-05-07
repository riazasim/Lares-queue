import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, NgModule } from '@angular/core';
import { ShadowDirective, CardShadows } from './card-shadows';


@Component({
  selector: '[card]',
  template: `
    <ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent extends ShadowDirective {

  @HostBinding('class')
  private get classList(): string {
    return `rounded-lg p-4 bg-white relative overflow-hidden ${CardShadows[this.shadow]}`;
  }
}


@NgModule({
  declarations: [
    CardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CardComponent
  ]
})
export class CardModule {}
