import { Directive, Input } from '@angular/core';

export type CardShadow = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'material';
type shadow = 'shadow';
type ShadowsMap = { [key in CardShadow]: `${shadow}-${key}` };

export const CardShadows: Readonly<ShadowsMap> = Object.freeze({
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  material: 'shadow-material'
});

@Directive()
export class ShadowDirective {
  @Input()
  public shadow: CardShadow = 'lg';
}
