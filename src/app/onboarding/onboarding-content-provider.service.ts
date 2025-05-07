import { Injectable } from '@angular/core';
import { type Observable, of } from 'rxjs';
import { AssetsProviderService } from 'src/app/core/services/assets-provider.service';
import { type OnboardingSlideContent } from 'src/app/shared/components/onboarding/onboarding-slide-content.interface';

export type AssetsType = 'admin' | 'onboarding' | 'portal' | 'shared' | 'images';

@Injectable()
export class OnboardingContentProviderService implements OnboardingContentProviderService {

  constructor(private readonly assetsProvider: AssetsProviderService<AssetsType>) {}

  public getContent(): Observable<OnboardingSlideContent[]> {
    return of([
      {
        pictureSrc: this.assetsProvider.asset('onboarding', 'step1.svg'),
        logoSrc: '',
        heading: 'Welcome!',
        description: ''
      },
      {
        pictureSrc: this.assetsProvider.asset('onboarding', 'step2.svg'),
        logoSrc: '',
        heading: 'Dashboard',
        description: 'Get a glimpse of the current situation through our centralised dashboard.'
      },
      {
        pictureSrc: this.assetsProvider.asset('onboarding', 'step3.svg'),
        logoSrc: '',
        heading: 'Scheduling',
        description: 'Schedule your shipments in advance, to reduce waiting time.'
      },
      {
        pictureSrc: this.assetsProvider.asset('onboarding', 'step4.svg'),
        logoSrc: '',
        heading: 'Status Tracker',
        description: 'Use our platform to track the status of the shipment so you can plan your resources accordingly.'
      },
      {
        pictureSrc: this.assetsProvider.asset('onboarding', 'step5.svg'),
        logoSrc: '',
        heading: 'Lares Yard integration\', description: \'If the partner uses Lares Yard app, you can automatically fetch shipment updates in real time.'
      },
      {
        pictureSrc: this.assetsProvider.asset('onboarding', 'step6.svg'),
        logoSrc: '',
        heading: 'Congrats !'
      }
    ]);
  }

}
