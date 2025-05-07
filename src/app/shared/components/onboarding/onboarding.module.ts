import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import SwiperCore, { Keyboard, Navigation, Pagination } from 'swiper';
import { SwiperModule } from 'swiper/angular';
import { OnboardingSlideComponent } from './onboarding-slide/onboarding-slide.component';
import { OnboardingSlideshowComponent } from './onboarding-slideshow/onboarding-slideshow.component';

SwiperCore.use([Navigation, Pagination, Keyboard]);

@NgModule({
    declarations: [OnboardingSlideComponent, OnboardingSlideshowComponent],
    imports: [CommonModule, SwiperModule],
    exports: [OnboardingSlideComponent, OnboardingSlideshowComponent],
    schemas:[NO_ERRORS_SCHEMA]
})
export class OnboardingSlideModule { }
