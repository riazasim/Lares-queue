import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import { GenericWrapperComponent } from '../generic-wrapper/generic-wrapper.component';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-search-select',
    templateUrl: './iconic-select-search.component.html',
    styleUrl: 'iconic-select-search.component.scss'
})
export class IconicSelectSearchComponent extends GenericWrapperComponent<any, any> {
    @Output() selected: EventEmitter<any> = new EventEmitter();
    @Output() searchQuery: EventEmitter<any> = new EventEmitter();
    @Output() scrollChange: EventEmitter<any> = new EventEmitter();

    @ViewChild('select', { static: false }) selectComponent: any;

    @Input() formGroup: FormGroup;

    @Input()
    public readonly rightIcon: IconProp = faCaretDown;
    // public rightIcon: IconProp | undefined;

    @Input()
    public leftSvg: string | undefined;

    @Input()
    public search: string;

    @Input()
    public formControlName: string;

    @Input()
    public formGroupName: string | number;

    @Input()
    public dashboardInp: boolean;

    @Input()
    public contentLoading: any = new BehaviorSubject(false);

    @Input()
    public isTable: boolean;

    @Input()
    public items: any = [];

    @Input()
    public loading: boolean | any;

    @Input()
    public isInvalid: boolean;

    @Input()
    public withoutTouched: boolean;

    @Input()
    public showValidationMessageDiv: boolean = true;

    @Input()
    public multiple: boolean = false;

    @Input()
    public styles: any;

    @Input()
    public placeholder: any;

    @Input()
    public value: any;

    typingTimeout: any;

    constructor() {
        super(
        );
    }

    onInputChange(ev: any) {
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            this.contentLoading.next(true);
            this.triggerSearch(ev?.target?.value);
        }, 300);
    }

    triggerSearch(search: String) {
        this.searchQuery.emit(search);
    }

    onSelectionChange(ev: any) {
        this.selected.emit(ev)
    }

    onOpenedChange(event: any) {
        // if (event && this.selectComponent) {
        //     this.selectComponent.panel.nativeElement.addEventListener('scroll', (event: any) => {
        //         const panelElement = this.selectComponent.panel.nativeElement;
        //         if (panelElement.scrollTop === panelElement.scrollHeight - panelElement.offsetHeight) {
        //             setTimeout(() => {
        //                 panelElement.scrollTop = 1;
        //                 this.contentLoading.next(true);
        //                 this.scrollChange.emit(20);
        //             }, 500)
        //         }
        //         if (panelElement.scrollTop === 0) {
        //             setTimeout(() => {
        //                 panelElement.scrollTop = 740;
        //                 this.contentLoading.next(true);
        //                 this.scrollChange.emit(-20);
        //             }, 500)
        //         }
        //     });
        // }
    }





    @ViewChild('select')
    override set inputRef(ref: any) {
        this._inputRef = ref.ngControl;
        console.log(this.formGroup, this.formControlName)

    }

}
