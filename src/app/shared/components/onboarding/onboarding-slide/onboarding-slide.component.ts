import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OnboardingSlideContent } from '../onboarding-slide-content.interface';


@Component({
  selector: 'onboarding-slide',
  templateUrl: './onboarding-slide.component.html',
  styleUrls: ['./onboarding-slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingSlideComponent {
  @Input()
  public slideContent: Partial<OnboardingSlideContent> | undefined;
}
