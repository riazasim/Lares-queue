import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { OnboardingSlideContent } from '../onboarding-slide-content.interface';

@Component({
    selector: 'onboarding-slideshow',
    templateUrl: './onboarding-slideshow.component.html',
    styleUrls: ['./onboarding-slideshow.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingSlideshowComponent {
    @Input()
    public slides: Observable<ReadonlyArray<OnboardingSlideContent>> | undefined;
}
