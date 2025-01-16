// export const getFormattedDate = (date: Date): string => {
//     const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
//     const month = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;
//     return `${date.getFullYear()}-${month}-${day}`;
// }

import * as moment from 'moment';

export const getFormattedDate = (date: Date): string => {
    if (!date) return '';

    const europeanFormat = new RegExp(/\d{2}[\.\-]\d{2}[\.\-]\d{4}/);
    const americanFormat = new RegExp(/\d{4}[\.\-]\d{2}[\.\-]\d{2}/);

    if (europeanFormat.test(<any>date) || americanFormat.test(<any>date)) {
        date = new Date(date);
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;

        return `${date.getFullYear()}-${month}-${day}`;
    }

    if (moment.isMoment(<any>date)) {
        date = (<any>date).toDate();
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;

        return `${date.getFullYear()}-${month}-${day}`;
    }

    if (Date.parse(<any>date) && <any>date instanceof Date) {
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;

        return `${date.getFullYear()}-${month}-${day}`;
    }

    return '';
}

/**
 * Normalizes any date format to db accepted one
 * 
 * @param {string } date any date format 
 * @returns date of format YYYY-MM-DD
 */
export const parseDateToDbFormat = (date: string): string => {
    if(/^\d\d[\.\-\/]\d\d[\.\-\/]\d\d\d\d$/.test(date)) {
        return `${date.slice(6)}-${date.slice(3, 5)}-${date.slice(0, 2)}`;
    }

    if (/^\d\d\d\d[\.\/]\d\d[\.\/]\d\d$/.test(date)) {
        return date.replace(/[\.\/]/g, '-');
    }

    return date;
}

/**
 * Parses hours (01:00) to minutes (60 minutes)
 * 
 * @return {number} duration
 */
export const parseHoursToMinutes = (duration: string|null): number|null => {
    if (!duration) return null;
    if (isNaN(+duration)) {
        const hours = `${duration}`.split(':')[0];
        const minutes = `${duration}`.split(':')[1];
        return (+hours * 60) + +minutes;
    }

    return +duration;
}