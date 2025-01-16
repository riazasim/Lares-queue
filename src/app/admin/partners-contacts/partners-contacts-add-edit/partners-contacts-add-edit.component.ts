import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnerContactModel } from 'src/app/core/models/partner-contact.model';
import { PartnerModel } from 'src/app/core/models/partner.model';
import { PartnerContactService } from 'src/app/core/services/partner-contact.service';
import { PartnerService } from 'src/app/core/services/partner.service';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
  selector: 'app-partners-contacts-add-edit',
  templateUrl: './partners-contacts-add-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnersContactsAddEditComponent implements OnInit {
  isLoading: boolean = true;
  partnerContactForm: UntypedFormGroup;
  partners: PartnerModel[] = [];
  id: number;
  constructor(private fb: UntypedFormBuilder,
              private route: ActivatedRoute,
              private partnerContactService: PartnerContactService,
              private partnerService: PartnerService,
              private router: Router,
              private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.retrievePartnersList();
    this.subscribeForQueryParams();
  }

  subscribeForQueryParams(): void {
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.id = params.id;
        this.partnerContactService.get(params.id).subscribe(response => {
          this.initForm(response);
          this.isLoading = false;
          this.cd.detectChanges();
        });
      } else {
        this.initForm();
        this.isLoading = false;
        this.cd.detectChanges();
      }
    })
  }

  retrievePartnersList(): void {
    // this.partnerService.list({}).subscribe((response: PartnerModel[]) => {
    //   this.partners = response;
    // });
  }

  updatePartnerId(event: MatAutocompleteSelectedEvent): void {
    this.partnerContactForm.get('fullName')?.patchValue(event.option.value.fullName);
    this.partnerContactForm.get('partnerId')?.patchValue(event.option.value.id);
  }

  initForm(data: PartnerContactModel = <PartnerContactModel>{}): void {
    this.partnerContactForm = this.fb.group({
      id: this.fb.control(data?.id),
      fullName: this.fb.control(data?.fullName || '', [...createRequiredValidators()]),
      email: this.fb.control(data?.email || '', [...createRequiredValidators()]),
      contactNumber: this.fb.control(data?.contactNumber || '', [...createRequiredValidators()]),
      address: this.fb.control(data?.address || '', [...createRequiredValidators()]),
      partnerId: this.fb.control(data?.partnerId || '', [...createRequiredValidators()]),
    });
  }

  savePartner(): void {
    this.isLoading = true;
    if (this.partnerContactForm.get('id')?.value) {
      this.partnerContactService.edit(this.id, this.partnerContactForm.value).subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['../../success'], { relativeTo: this.route });
      });
    } else {
      this.partnerContactService.create(this.partnerContactForm.value).subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
    }
  }
}
