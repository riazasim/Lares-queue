import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';

interface HourModel {
    h1: number,
    h2: number,
    m1: number,
    m2: number,
    s1: number,
    s2: number
}

@Component({
    selector: 'timepicker',
    templateUrl: './timepicker.component.html',
    styleUrls: ['./timepicker.component.scss']
})
export class TimepickerComponent implements OnInit {
    @ViewChild('inputTrigger') inputTrigger: MatMenuTrigger;
    @Input() formGroup: FormGroup;
    @Input() field: string;
    @Input() placeholder: string = 'Pick a time';
    @Input() model: string;
    @Input() isMinutes: boolean;
    @Input() loading: boolean | any;
    @Input() height: number;

    @Output() modelChange: EventEmitter<string> = new EventEmitter();
    isLoading: boolean = false;
    hourModel: HourModel = { h1: 0, h2: 0, m1: 0, m2: 0, s1: 0, s2: 0 };

    constructor() { }

    ngOnInit(): void {
        this.initializeTime();
    }

    initializeTime(): void {
        if (this.formGroup && this.formGroup?.get(this.field)?.value) {
            this.hourModel = {
                h1: +this.formGroup.get(this.field)?.value.substring(0, 1),
                h2: +this.formGroup.get(this.field)?.value.substring(1, 2),
                m1: +this.formGroup.get(this.field)?.value.substring(3, 4),
                m2: +this.formGroup.get(this.field)?.value.substring(4, 5),
                s1: +this.formGroup.get(this.field)?.value.substring(6, 7),
                s2: +this.formGroup.get(this.field)?.value.substring(7, 8),
            };
            return;
        }
    }

    increment(event: Event, field: string): void {
        event.stopPropagation();
        const h1 = this.hourModel.h1;
        const h2 = this.hourModel.h2;
        const m1 = this.hourModel.m1;
        const m2 = this.hourModel.m2;
        const s1 = this.hourModel.s1;
        const s2 = this.hourModel.s2;

        switch (field) {
            case 'h1':
                switch (true) {
                    case h1 === 1 && h2 > 3 || h1 >= 2: this.hourModel.h1 = 0; break;
                    default: this.hourModel.h1 = this.hourModel.h1 + 1; break;
                }

                return;

            case 'h2':
                switch (true) {
                    case h1 === 2 && h2 === 3: this.hourModel.h1 = 0; this.hourModel.h2 = 0; break;
                    case (h1 === 0 || h1 === 1) && h2 === 9: this.hourModel.h1 = 2; this.hourModel.h2 = 0; break;
                    case h2 >= 9: this.hourModel.h2 = 0; break;
                    default: this.hourModel.h2 = this.hourModel.h2 + 1; break;
                }

                return;

            case 'm1':
                switch (true) {
                    case m1 >= 5: this.hourModel.m1 = 0; break;
                    default: this.hourModel.m1 = this.hourModel.m1 + 1; break;
                }

                return;

            case 'm2':
                switch (true) {
                    case m1 === 5 && m2 === 9: this.hourModel.m1 = 0; this.hourModel.m2 = 0; break;
                    case m2 === 9: this.hourModel.m1++; this.hourModel.m2 = 0; break;
                    case m2 > 9: this.hourModel.m2 = 0; break;
                    default: this.hourModel.m2 = this.hourModel.m2 + 1; break;
                }

                return;

            case 's1':
                switch (true) {
                    case s1 >= 5: this.hourModel.s1 = 0; break;
                    default: this.hourModel.s1 = this.hourModel.s1 + 1; break;
                }

                return;

            case 's2':
                switch (true) {
                    case s1 === 5 && s2 === 9: this.hourModel.s1 = 0; this.hourModel.s2 = 0; break;
                    case s2 === 9: this.hourModel.s1++; this.hourModel.s2 = 0; break;
                    case s2 > 9: this.hourModel.s2 = 0; break;
                    default: this.hourModel.s2 = this.hourModel.s2 + 1; break;
                }

                return;
        }
    }

    decrement(event: Event, field: string): void {
        event.stopPropagation();

        const h1 = this.hourModel.h1;
        const h2 = this.hourModel.h2;
        const m1 = this.hourModel.m1;
        const m2 = this.hourModel.m2;
        const s1 = this.hourModel.s1;
        const s2 = this.hourModel.s2;

        switch (field) {
            case 'h1':
                switch (true) {
                    case h1 === 0: this.hourModel.h1 = 2; break;
                    default: this.hourModel.h1 = this.hourModel.h1 - 1; break;
                }

                return;

            case 'h2':
                switch (true) {
                    case (h1 === 1 || h1 === 2) && h2 === 0: this.hourModel.h1--; this.hourModel.h2 = 0; break;
                    case h2 === 0: this.hourModel.h2 = 9; break;
                    default: this.hourModel.h2 = this.hourModel.h2 - 1; break;
                }

                return;

            case 'm1':
                switch (true) {
                    case m1 === 0: this.hourModel.m1 = 5; break;
                    default: this.hourModel.m1 = this.hourModel.m1 - 1; break;
                }

                return;

            case 'm2':
                switch (true) {
                    case m1 >= 1 && m2 === 0: this.hourModel.m1--; this.hourModel.m2 = 9; break;
                    case m2 === 0: this.hourModel.m2 = 9; break;
                    default: this.hourModel.m2 = this.hourModel.m2 - 1; break;
                }

                return;

            case 's1':
                switch (true) {
                    case s1 === 0: this.hourModel.s1 = 5; break;
                    default: this.hourModel.s1--; break;
                }

                return;

            case 's2':
                switch (true) {
                    case s1 >= 1 && s2 === 0: this.hourModel.s1--; this.hourModel.s2 = 9; break;
                    case s2 === 0: this.hourModel.s2 = 9; break;
                    default: this.hourModel.s2--; break;
                }

                return;
        }
    }

    save(e: Event): void {
        if (this.hourModel.h1 > 2 || this.hourModel.h2 > 9 || this.hourModel.m1 > 5 || this.hourModel.m2 > 9) {
            return;
        }

        if (this.formGroup) {
            this.formGroup.get(this.field)?.patchValue(this.getHourFormat());
        } else {
            this.model = this.getHourFormat();
            this.modelChange.emit(this.model)
        }

        this.inputTrigger.closeMenu();
    }

    getHourFormat(): string {
        if (this.isMinutes) {
            return `${this.hourModel.h1}${this.hourModel.h2}:${this.hourModel.m1}${this.hourModel.m2}`;
        }

        return `${this.hourModel.h1}${this.hourModel.h2}:${this.hourModel.m1}${this.hourModel.m2}:${this.hourModel.s1}${this.hourModel.s2}`;
    }

}
