import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShadowDirective } from '../card-shadows';
import { CardModule } from '../card.module';
import { Nullable } from 'src/app/core/models/navigation-menu.model';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: '[statistic-card-v2]',
  templateUrl: 'statistic-card-v2.component.html'
})
export class StatisticCardV2Component extends ShadowDirective {
  @Input()
  public numericValue: string | number = 0;

  @Input()
  public label = '';

  @Input()
  public icon: Nullable<IconProp> = null;

  @Input()
  public colorStyle = 'var(--primary-color)';

  @Input()
  public textColor = '#000'

  @Input()
  public dashSvg: string | undefined;
}

@NgModule({
  declarations: [StatisticCardV2Component],
  imports: [
    CommonModule,
    CardModule,
    FontAwesomeModule
  ],
  exports: [StatisticCardV2Component]
})
export class StatisticCardV2Module {}
