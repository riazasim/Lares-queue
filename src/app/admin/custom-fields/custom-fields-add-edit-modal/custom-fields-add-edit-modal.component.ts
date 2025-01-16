import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, pairwise, startWith } from 'rxjs';
import {
  OPERATION_DATA,
  CONTACT_DATA,
  PARTNER_DATA,
  LOCATION_DATA,
  VEHICLE_DATA,
  USER_DATA,
} from 'src/app/core/constants/custom-field-module';

import { CustomFieldList, CustomFieldModel, ResponseCustomFieldModel } from 'src/app/core/models/custom-field.model';
import { NativeResponseWrapper } from 'src/app/core/models/response-wrappers.types';
import { CustomFieldService } from 'src/app/core/services/custom-field.service';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
  selector: 'app-custom-fields-add-edit-modal',
  templateUrl: './custom-fields-add-edit-modal.component.html',
  styleUrls: ['./custom-fields-add-edit-modal.component.scss']
})
export class CustomFieldsAddEditModalComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  inputType$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  customFieldGroup: FormGroup;
  constructor(private readonly dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: { id: number, moduleType: string },
              private readonly fb: FormBuilder,
              private readonly customFieldService: CustomFieldService,
              private readonly snackBar: MatSnackBar) {}

  ngOnInit(): void {
    if (this.data.id) {
      this.customFieldService.get(this.data.id).subscribe((response: ResponseCustomFieldModel) => {
        this.inputType$.next(response.type);
        this.initForm(response);
        this.subscribeForTypeChanges()
        this.isLoading$.next(false);
      });
    } else {
      this.initForm();
      this.subscribeForTypeChanges()
      this.isLoading$.next(false);
    }
  }

  initForm(data: ResponseCustomFieldModel = <ResponseCustomFieldModel>{}): void {
    this.customFieldGroup = this.fb.group({
      label: this.fb.control(data?.label || null, []),
      name: this.fb.control(data?.name || null, [...createRequiredValidators()]),
      type: this.fb.control(data?.type || '', [...createRequiredValidators()]),
      format: this.fb.control(data?.format || '', []),
      required: this.fb.control(data?.required || null, []),
      placeholder: this.fb.control(data?.placeholder || null, []),
      description: this.fb.control(data?.description || null, []),
      module: this.fb.control(this.setModule(data?.module) || null, [...createRequiredValidators()]),
      customFieldLists: this.fb.array(
        (<CustomFieldList[]>data?.customFieldLists)?.length ?
        (<CustomFieldList[]>data.customFieldLists).map(x => this.createCustomFieldList(x)) : []
        )
    });
  }

  openMenu(trigger: MatMenuTrigger, i: number): void {
    this.customFieldsList.at(i).get('value')?.patchValue(this.customFieldsList.at(i)?.get('value')?.value)
    trigger.openMenu();
  }

  updateLabel(i: number): void {
    this.isLoading$.next(true);
    const value = this.customFieldsList.at(i).value.value;
    const label = this.customFieldsList.at(i).value.label;
    this.customFieldsList.removeAt(i);
    this.customFieldsList.controls.splice(i, 0, this.createCustomFieldList({ value, label }));
    this.isLoading$.next(false);
  }

  get customFieldsList(): FormArray {
    return this.customFieldGroup.controls["customFieldLists"] as FormArray;
  }

  addCustomFieldList(): void {
    this.customFieldsList.push(this.createCustomFieldList());
  }

  removeCustomFieldList(i: number): void {
    this.customFieldsList.removeAt(i);
  }

  createCustomFieldList(data?: CustomFieldList): FormGroup {
    return this.fb.group({
      id: this.fb.control(data?.id || null),
      label: this.fb.control(data?.label || 'Label'),
      value: this.fb.control(data?.value || 'value')
    })
  }

  subscribeForTypeChanges(): void {
    this.customFieldGroup.get('type')?.valueChanges.pipe(
      startWith(''),
      pairwise()).subscribe(([prev, next]: [string, string]) => {
      this.isLoading$.next(true);
      if (!['date', 'time'].includes(next) ||
          prev === 'date' && next === 'time' ||
          prev === 'time' && next === 'date') {
        this.customFieldGroup.get('format')?.patchValue('');
      }

      if (!['checkbox', 'radio'].includes(prev) && ['checkbox', 'radio'].includes(next)) {
        this.customFieldsList.controls.push(
          this.createCustomFieldList(),
          this.createCustomFieldList(),
          this.createCustomFieldList(),
          this.createCustomFieldList()
        )
      }

      if (['checkbox', 'radio'].includes(prev) && !['checkbox', 'radio'].includes(next)) {
        this.customFieldsList.controls.length = 0;
      }

      this.inputType$.next(next)
      this.isLoading$.next(false);
    });
  }

  private setModule(module: string): string {
    switch(this.data.moduleType) {
      case 'operation-data': return OPERATION_DATA;
      case 'contact-data': return CONTACT_DATA;
      case 'partner-data': return PARTNER_DATA;
      case 'location-data': return LOCATION_DATA;
      case 'vehicle-data': return VEHICLE_DATA;
      case 'user-data': return USER_DATA;
      default: return module;
    }
  }

  save(): void {
    this.isLoading$.next(true);
    if (this.data.id) {
      this.customFieldService.update(this.data.id, this.parseData(this.customFieldGroup.value)).subscribe({
        next: () => {
          this.confirm();
          this.isLoading$.next(false);
        },
        error: (error) => {
          this.handleError(error, 'update');
          this.isLoading$.next(false);
        }
      })
    } else {
      this.customFieldService.create(this.parseData(this.customFieldGroup.value)).subscribe({
        next: () => {
          this.confirm();
          this.isLoading$.next(false);
        },
        error: (error) => {
          this.handleError(error, 'create');
          this.isLoading$.next(false);
        }
      })
    }
  }

  handleError(body: NativeResponseWrapper<CustomFieldModel>, requestType: string): void {
    if (body.code === 400) {
      for(let prop in body.error.form) {
        this.snackBar.open('Error!', (<any>body.error.form)[prop], {
          duration: 3000,
          horizontalPosition: 'end',
          panelClass: ['error-snackbar'],
          verticalPosition: 'bottom',
        })
      }
    } else {
      this.snackBar.open('Error!', '', {
        duration: 3000,
        horizontalPosition: 'end',
        panelClass: ['error-snackbar'],
        verticalPosition: 'bottom',
      })
    }
  }

  private parseData(data: CustomFieldModel): CustomFieldModel {
    if (['radio', 'checkbox'].includes(data.type) && !this.data.id) {
      data.customFieldLists = (<CustomFieldList[]>data.customFieldLists).map(x => {
        if (!x.id) delete x.id;
        return x;
      });
    }

    return data;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

}
