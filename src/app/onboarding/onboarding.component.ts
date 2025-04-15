import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef, HostListener, Inject, OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AssetsProviderService } from 'src/app/core/services/assets-provider.service';
import { OnboardingSlideContent } from 'src/app/shared/components/onboarding/onboarding-slide-content.interface';
import { OnboardingSlideshowComponent } from '../shared/components/onboarding/onboarding-slideshow/onboarding-slideshow.component';
import { type AssetsType } from './onboarding-content-provider.service';
import {
  ONBOARDING_CONTENT_PROVIDER,
  OnboardingContentProvider
} from './onboarding-content-provider.type';

@Component({
  templateUrl: './onboarding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const nr = document?.getElementsByClassName('swiper-slide swiper-slide-active')[0]?.getAttribute('data-swiper-slide-index')
    if (+ (nr ?? 0) === 6) {
      this.setTutorialTrue();
      this.navigate();
    }
  }

  @ViewChild(OnboardingSlideshowComponent, { static: true }) slideShow: ElementRef<any>|null = null;

  @ViewChild('letsStartBtnTemplate', { static: true })
  private readonly letsStartBtnTemplate!: TemplateRef<HTMLButtonElement>;

  public onboardingSlides$: Observable<OnboardingSlideContent[]>;

  constructor(private readonly assetsProvider: AssetsProviderService<AssetsType>,
    @Inject(ONBOARDING_CONTENT_PROVIDER) private readonly contentProvider: OnboardingContentProvider,
    private router: Router,
  private route: ActivatedRoute) {
    this.onboardingSlides$ = this.contentProvider.getContent();
  }

  ngOnInit(): void {
    this.onboardingSlides$ = this.onboardingSlides$
      .pipe(
        tap(slides => slides[slides.length - 1].customContent = this.letsStartBtnTemplate)
      );
  }

  navigate() {
    this.router.navigate(['../admin/dashboard'], { relativeTo: this.route });
  }

  setTutorialTrue() {
    localStorage.setItem('tutorial', 'true');
  }

}
