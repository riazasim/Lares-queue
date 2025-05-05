import { MatSnackBar } from "@angular/material/snack-bar"
import { BehaviorSubject } from 'rxjs';
import { NativeResponseWrapper } from "src/app/core/models/response-wrappers.types";

export const handleError = (matSnackBar: MatSnackBar, body: NativeResponseWrapper<any>, isLoading$?: BehaviorSubject<boolean>) => {
    if (body.code === 400 && body?.error?.form) {
        for(let prop in body.error.form) {
        matSnackBar.open(`${prop} - ${body.error.form[prop]}`, 'Error', {
            duration: 3000,
            horizontalPosition: 'center',
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
        })
        }
    } else {
       // matSnackBar.open(`${body?.error?.detail}`, 'Error', {
        matSnackBar.open(`${body?.data?.attributes?.message}`, 'Error', {
        duration: 3000,
        horizontalPosition: 'center',
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        })
    }

    if (isLoading$) isLoading$.next(false);
}
