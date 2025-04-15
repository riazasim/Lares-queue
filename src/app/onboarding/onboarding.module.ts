import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OnboardingSlideModule } from 'src/app/shared/components/onboarding/onboarding.module';
import { AssetsProviderService } from '../core/services/assets-provider.service';

import { OnboardingContentProviderService } from './onboarding-content-provider.service';
import { ONBOARDING_CONTENT_PROVIDER } from './onboarding-content-provider.type';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './onboarding.component';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    OnboardingComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    OnboardingSlideModule,
    MatRippleModule,
  ],
  providers: [
    AssetsProviderService,
    {
      provide: ONBOARDING_CONTENT_PROVIDER,
      useClass: OnboardingContentProviderService
    }
  ]
})
export class OnboardingModule {}
