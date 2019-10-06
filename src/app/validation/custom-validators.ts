import { FormGroup, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export function NotBeforeToday(control: AbstractControl
): { [key: string]: any } | null {
    if (!control.value) {
        return;
    }
    const ngbDate = control.value as NgbDate;
    if (!ngbDate) {
        return;
    }
    const dateString = `${ngbDate.year}-${ngbDate.month}-${ngbDate.day}`;
    if (!moment(dateString, 'YYYY-MM-DD').isValid()) {
        return { dateFormat: { valid: false, value: control.value } };
    }
    const date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    const today = moment().startOf('day').toDate();
    if (date < today) {
        return { beforeToday: { valid: false, value: control.value } };
    } else {
        return null;
    }
}

export function NotBeforeControlDate(controlName: string, compareControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const compareControl = formGroup.controls[compareControlName];

        if (!control.value) {
            return;
        }
        if (compareControl.errors) {
            return;
        }
        const ngbDate = control.value as NgbDate;
        if (!ngbDate) {
            return;
        }
        const ngbCompareDate = compareControl.value as NgbDate;
        if (!ngbCompareDate) {
            return;
        }
        const date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
        const today = moment().startOf('day').toDate();
        if (date < today) {
            return;
        }
        const compareDate = new Date(ngbCompareDate.year, ngbCompareDate.month - 1, ngbCompareDate.day);
        if (date < compareDate) {
            control.setErrors({ beforeDate: true });
        } else {
            control.setErrors(null);
        }
    };
}
