import { Component, ContentChild, Input } from '@angular/core';

import { SelectRefDirective } from '../../directives/select-ref.directive';
import { GenericWrapperComponent } from '../generic-wrapper/generic-wrapper.component';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons';

@Component({
    selector: '[iconic-select-wrapper]',
    templateUrl: './iconic-select-wrapper.component.html',
    styles: [
        `
    .select-container {
        position: relative;
        flex-grow: 1;
        display: flex;
    }
    .select-decoration {
        position: absolute;
        right: 10px;
        color: black;
    }
    
    `
    ]
})
export class IconicSelectWrapperComponent extends GenericWrapperComponent<HTMLSelectElement, SelectRefDirective> {

    @Input()
    public readonly rightIcon: IconProp = faCaretDown;
    // public rightIcon: IconProp | undefined;

    @Input()
    public leftSvg: string | undefined;

    @Input()
    public dashboardInp: boolean;

    @Input()
    public isTable: boolean;

    @Input()
    public loading: boolean | any;

    @Input()
    public isInvalid: boolean;

    @Input()
    public withoutTouched: boolean;

    @Input()
    public showValidationMessageDiv: boolean = true;

    @ContentChild(SelectRefDirective)
    override set inputRef(ref: SelectRefDirective) {
        this._inputRef = ref;
    }

}
