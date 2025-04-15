import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { faTriangleExclamation } from '@fortawesome/pro-solid-svg-icons';

@Component({
    selector: 'app-warning-modal',
    templateUrl: './warning-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarningModalComponent {
    xmark: IconProp = faXmark;
    warn: IconProp = faTriangleExclamation;
    constructor(private readonly dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data?: any) {
    }

    cancel(): void {
        this.dialogRef.close(false);
    }

    confirm(): void {
        this.dialogRef.close(true);
    }

}
