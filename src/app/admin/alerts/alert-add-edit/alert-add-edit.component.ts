import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LocationModel } from 'src/app/core/models/location.model';
import { LocationService } from 'src/app/core/services/location.service';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';
@Component({
  selector: 'app-alert-add-edit',
  templateUrl: './alert-add-edit.component.html',
})
export class AlertAddEditComponent {
  /*alertForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  id: number;
  constructor(private fb: UntypedFormBuilder,
              private alertService: AlertService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscribeForQueryParams();
  }

  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.locationService.get(this.id).subscribe(async response => {
        this.initForm(response);
        this.location$.next({...response })
        this.isLoading$.next(false);
      });
    } else {
      this.initForm();
      this.isLoading$.next(false);
    }
  }

  clearImage(): void {
    const location = this.location$.value;
    if (location) {
      location.image = null as any;
    }
    this.locationForm.get('image')?.patchValue(null);
  }

  initForm(data: LocationModel = <LocationModel>{}): void {
    this.locationForm = this.fb.group({
      id: this.fb.control(data?.id),
      name: this.fb.control(data?.name || '', [...createRequiredValidators()]),
      googleMapCoordinate: this.fb.control(data?.googleMapCoordinate || '', [...createRequiredValidators()]),
      street: this.fb.control(data?.street || '', [...createRequiredValidators()]),
      streetNo: this.fb.control(data?.streetNo || '', [...createRequiredValidators()]),
      city: this.fb.control(data?.city || '', [...createRequiredValidators()]),
      county: this.fb.control(data?.county || '', [...createRequiredValidators()]),
      country: this.fb.control(data?.country || '', [...createRequiredValidators()]),
      zipCode: this.fb.control(data?.zipCode || '', [...createRequiredValidators()]),
      firstName: this.fb.control(data?.firstName || '', [...createRequiredValidators()]),
      lastName: this.fb.control(data?.lastName || '', [...createRequiredValidators()]),
      mobile: this.fb.control(data?.mobile || '', [...createRequiredValidators()]),
      email: this.fb.control(data?.email || '', [...createRequiredValidators(), Validators.email]),
      image: this.fb.control(data?.image, []),
      customFields: this.fb.control(data?.customFields, []),
    });
  }

  setImage(target: any, input: any): void {
    if (target.files.item(0)) {
      input.value = target.files.item(0).name
      this.locationForm.get('image')?.patchValue(target.files.item(0));
    }
  }

  saveLocation(): void {
    if (this.locationForm.get('id')?.value) {
      this.locationService.edit(this.parseData(this.locationForm.value)).subscribe(() => {
        this.router.navigate(['../../success'], { relativeTo: this.route });
      });
    } else {
      this.locationService.create(this.locationForm.value).subscribe(() => {
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
    }
  }

  parseData(location: any): any {
    const data = {...location};
    if (!data.image) {
      delete data.image;
    }

    return location;
  }*/
}
