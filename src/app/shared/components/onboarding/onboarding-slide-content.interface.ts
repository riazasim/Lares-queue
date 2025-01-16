import { TemplateRef } from '@angular/core';

export interface OnboardingSlideContent {
    logoSrc?: string;
    pictureSrc: string;
    heading: string;
    description?: string;
    customContent?: TemplateRef<unknown>;
}
