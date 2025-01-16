import { Component, ChangeDetectorRef } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PartnerModel } from '../../../core/models/partner.model';
import { StatusListModel } from 'src/app/core/models/status-list.model';
import { StatusListService } from 'src/app/core/services/status-list.service';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
  selector: 'app-list-management-list-add-edit',
  templateUrl: './list-management-add-edit.component.html',
})
export class ListManagementAddEditComponent {
  isLoading: boolean = true;
  listForm: FormGroup;
  lists: StatusListModel[] = [];
  id: number;

  constructor(private readonly fb: UntypedFormBuilder,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly listService: StatusListService,
              private readonly cd: ChangeDetectorRef) {
    this.subscribeForQueryParams();
  }

  subscribeForQueryParams(): void {
    this.route.params.subscribe((params: any) => {
      if (params.id) {} else {
        this.initForm();
        this.isLoading = false;
        this.cd.detectChanges();
      }
    })
  }

  updateListId(event: MatAutocompleteSelectedEvent): void {
    this.listForm.get('name')?.patchValue(event.option.value.name);
    this.listForm.get('id')?.patchValue(event.option.value.id);
  }

  initForm(data: StatusListModel = <StatusListModel>{}): void {
    this.listForm = this.fb.group({
      name: this.fb.control(data?.name || '', [...createRequiredValidators()]),
      type: this.fb.control(data?.type || '', [...createRequiredValidators()]),
      color: this.fb.control(data?.color || '', [...createRequiredValidators()]),
      description: this.fb.control(data?.description || '', [...createRequiredValidators()]),
    });
  }

  saveList(): void {
    this.isLoading = true;
    if (this.listForm.get('id')?.getRawValue()) {
    } else { }
  }

  private parseData(data: PartnerModel): PartnerModel {
    if (!data.id) delete data.id;
    data.status = data.status as any === "true" ? true : false;
    return data;
  }
}
