import { CountryModel } from "src/app/core/models/location.model";

export const getIndexByIdObjectArray = (id: number, array: any[]): number|null => {
    let index = null;
    const length = array.length;
    for (let i = 0; i < length; i++) {
        if (id === array[i].id) {
            index = i;
            break;
        }
    }

    return index;
}

export const setupCountries = (countries: CountryModel[]): CountryModel[] => {
    const codes = ['ro', 'md', 'ua', 'bg', 'hu', 'rs']
    const firstCountries = countries.filter(c => codes.includes(c.code)).sort((a,b) => codes.indexOf(a.code) - codes.indexOf(b.code));
    const lastCountries = countries.filter(c => !codes.includes(c.code));

    return [...firstCountries, ...lastCountries];
}