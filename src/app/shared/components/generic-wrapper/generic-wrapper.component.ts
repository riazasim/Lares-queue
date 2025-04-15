import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faXmark } from '@fortawesome/pro-regular-svg-icons';
import { GenericRef } from '../../directives/generic-ref';


@Component({
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericWrapperComponent<T1, T2 extends GenericRef<T1>> {
    protected _inputRef: T2 | undefined;

    protected readonly _checkmark = faCheck;
    protected readonly _xmark = faXmark;

    @Input()
    public showValidation = true;

    @Input()
    public leftIcon: IconProp | undefined;

    @Input()
    public withCheckmark = true;

    @Input()
    public appendedTemplate: TemplateRef<unknown> | undefined;

    @Input()
    public validationMessagesMetadata: { [key: string]: string } | undefined;

    @Input()
    public showValidationMessages = true;

    set inputRef(ref: T2) {
        this._inputRef = ref;
    }

    get checkmark(): IconProp {
        return this._checkmark as IconProp;
    }

    get xmark(): IconProp {
        return this._xmark as IconProp;
    }

    get isValid(): boolean | undefined {
        return this.showValidation ? this._inputRef?.control?.valid : undefined;
    }

    get errors(): ValidationErrors | null {
        const formControl = this._inputRef?.control;
        if (formControl === undefined || !this.showValidation) {
            return null;
        }
        return formControl?.errors;
    }

    get isDisabled(): boolean | undefined {
        return this._inputRef?.control?.disabled;
    }

    get isTouched(): boolean | undefined {
        return this._inputRef?.control?.touched ?? false;
    }

    get isDirty(): boolean | undefined {
        return this._inputRef?.control?.dirty ?? false;
    }
    get isValidControl(): boolean | undefined {
        return this._inputRef?.control?.valid
    }

    get isInvalidControl(): boolean | undefined {
        return this._inputRef?.control?.invalid;
    }
}
