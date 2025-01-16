import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { OnboardingSlideContent } from 'src/app/shared/components/onboarding/onboarding-slide-content.interface';

export interface ContentProvider<T> {
  getContent(): T;
}

export type ObservableContentProvider<T> = ContentProvider<Observable<T>>;

export type OnboardingContentProvider = ObservableContentProvider<OnboardingSlideContent[]>;
export const ONBOARDING_CONTENT_PROVIDER = new InjectionToken<OnboardingContentProvider>('The onboarding content provider');
