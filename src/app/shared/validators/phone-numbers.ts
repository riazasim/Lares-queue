import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { phoneNumberFormatValidationMessage } from './errors.keys';

type PhoneNumberType = 'ro' | 'bg';

const RegexMap: Readonly<Map<PhoneNumberType, RegExp>> = Object.freeze(new Map<PhoneNumberType, RegExp>([
    [
        'ro', /^(07[0-8]\d|02\d{2}|03\d{2})(\d{3}){2}$/
    ],
    [
        'bg', /^((02)|(2))?\d{9}$/
    ]
]));

const validationError: () => ValidationErrors = () => ({
    phoneNumberFormat: {
        message: phoneNumberFormatValidationMessage()
    }
});

export function phoneNumberValidator(type: PhoneNumberType): ValidatorFn {
    const regex = RegexMap.get(type);
    if (regex === undefined) {
        throw Error('Invalid phone number type');
    }
    return (control: AbstractControl): ValidationErrors | null => {
        const val = control.value;
        if (typeof val !== 'string') {
            return validationError();
        }
        const match = val.trim().match(regex);
        return match ? null : validationError();
    };
}
export const decideParsePhoneNumber = (phoneCountry: string, phoneNumber: string): string => {
    if (phoneCountry === 'ro') {
        return phoneNumber.split(' ').join('').startsWith('+40') ? phoneNumber : `+40${phoneNumber}`;
    }

    if (phoneCountry === 'en' || phoneCountry === 'us') {
        return phoneNumber.split(' ').join('').startsWith('+1') ? phoneNumber : `+1${phoneNumber}`;
    }

    return phoneNumber;
};

export const extractPhoneNumber = (phoneNumber: string, phoneRegionCode: string = ''): string => {
    if (!phoneNumber) {
        return ''
    }

    if (phoneRegionCode && phoneRegionCode === '+40' && phoneNumber.startsWith('0')) {
        return phoneNumber.slice(1).replace(/[\)\(\- ]/g, '').trim();
    }

    return phoneNumber.replace(/[\)\(\- ]/g, '').trim();
}
