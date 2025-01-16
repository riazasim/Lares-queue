import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
    @Input() formGroup: FormGroup;
    @Input() field: string;
    @Input() placeholder: string = 'Pick a date';
    @Input() disabled: boolean;
    @Input() loading: boolean | any;

    @Input() height: number;
    @Input() isHeaderPosition: boolean;

    @Input() model: string | Date;

    @Input() textAlign: string;

    @Input() maxDate: Date;
    @Input() minDate: Date;

    @Output() dateChanged: EventEmitter<string> = new EventEmitter<string>();
    @Output() dateRemoved: EventEmitter<boolean> = new EventEmitter<boolean>();

    styles: any = {};
    constructor() { }

    ngOnInit(): void {
        if (this.height) {
            this.styles = {
                minHeight: 'auto',
                height: `${this.height}px`
            }
        }

        if (this.isHeaderPosition) {
            this.styles['borderRadius'] = '5px';
        }
    }
}
