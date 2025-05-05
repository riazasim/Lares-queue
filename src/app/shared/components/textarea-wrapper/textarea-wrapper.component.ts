import { Component, ContentChild, Input } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { InputRefDirective } from '../../directives/input-ref.directive';
import { GenericWrapperComponent } from '../generic-wrapper/generic-wrapper.component';


@Component({
  selector: '[textarea-wrapper]',
  templateUrl: './textarea-wrapper.component.html'
})
export class TextareaWrapperComponent extends GenericWrapperComponent<HTMLInputElement, InputRefDirective>{

  @Input()
  public rightIcon: IconProp | undefined;

  @Input()
  public isFullHeight: boolean;

  @ContentChild(InputRefDirective)
  override set inputRef(ref: InputRefDirective) {
    this._inputRef = ref;
  }

}
