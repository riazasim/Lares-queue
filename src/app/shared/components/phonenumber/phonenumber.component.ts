import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { CountryModel } from 'src/app/core/models/location.model';
import { LocationService } from 'src/app/core/services/location.service';
import { TranslateService } from '@ngx-translate/core';
import { phoneNumberValidation, requiredValidation } from 'src/app/public/booking.helper';
import { NgxMaskPipe } from 'ngx-mask';
import { setupCountries } from '../../utils/af-array.functions';

@Component({
    selector: 'phonenumber',
    templateUrl: './phonenumber.component.html',
    styleUrls: ['./phonenumber.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhonenumberComponent implements OnInit {

    @Output() doneInit: EventEmitter<any> = new EventEmitter();


    @Input() containerClass: string;

    @Input() selectedCountry: string; // Moldova
    @Input() selectedCountryModel: CountryModel; // { ... } instance of CountryModel
    @Input() selectedCountryCode: string; // md
    @Input() selectedPhoneRegionCode: string; // +373

    @Input() formGroup: FormGroup;
    @Input() field: string;
    @Input() buttonField: string;
    @Input() buttonPlaceholder: string;
    @Input() placeholder: string;
    @Input() public loading: any;

    @Output() readonly phoneSelected: EventEmitter<CountryModel> = new EventEmitter();

    selectedCountry$: BehaviorSubject<CountryModel | null> = new BehaviorSubject<CountryModel | null>(null);
    countries: CountryModel[] = [];
    countries$: Observable<CountryModel[]> = this.locationService.listCountries();
    constructor(private readonly locationService: LocationService,
        private readonly maskPipe: NgxMaskPipe,
        private readonly translate: TranslateService) { }

    ngOnInit(): void {
        this.initializeCountries();
    }

    initializeCountries(): void {
        this.countries$.subscribe((response) => {
            this.countries = setupCountries(response);
            this.initializeSelectedCountry();
            this.doneInit.emit(true)
        })
    }

    parsePasteNumber(event: ClipboardEvent): void {
        event.stopPropagation();
        event.preventDefault();
        const clipboardData = event.clipboardData || (<any>window).clipboardData;
        const value = clipboardData.getData('text');

        if (value && this.selectedCountry$.getValue()) {
            const nonZeroValue = value.startsWith('0') ? value.slice(1) : value;
            this.formGroup.get(this.field)?.patchValue(this.maskPipe.transform(nonZeroValue, this.selectedCountry$.getValue()!.mask));
        }
    }

    selectCountry(country: CountryModel): void {
        this.selectedCountry$.next(country);
        this.formGroup.get(this.field)?.markAsTouched();
        this.formGroup.get(this.field)?.patchValue(null);
        this.setValidation(country);
        this.phoneSelected.emit(country);
    }

    private initializeSelectedCountry(): void {
        if (this.selectedCountry) {
            const country = this.countries.find(c => c.name === this.selectedCountry);
            this.setValidation(country);
            this.selectedCountry$.next(country!);
            return;
        }

        if (this.selectedCountryModel) {
            this.setValidation(this.selectedCountryModel);
            this.selectedCountry$.next(this.selectedCountryModel);
            return;
        }

        if (this.selectedCountryCode) {
            const country = this.countries.find(c => c.code === this.selectedCountryCode);
            this.setValidation(country);
            this.selectedCountry$.next(country!);
            return;
        }

        if (this.selectedPhoneRegionCode || this.formGroup.get(this.buttonField)?.value) {
            const country = this.countries.find(c => c.dialCode === this.selectedPhoneRegionCode);
            this.setValidation(country);
            this.selectedCountry$.next(country!);
            return;
        }

        console.log(this.formGroup.get(this.field))
        this.setValidation();
    }

    private setValidation(country?: CountryModel): void {
        if (country) {
            this.formGroup.get(this.buttonField)?.patchValue(country.dialCode);
            this.formGroup.get(this.field)?.setValidators([
                requiredValidation(this.translate),
                phoneNumberValidation(this.translate, country)
            ]);
        } else {
            this.formGroup.get(this.field)?.setValidators([
                requiredValidation(this.translate),
            ])
        }
    }
}
