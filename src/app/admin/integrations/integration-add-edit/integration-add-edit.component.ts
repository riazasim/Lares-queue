import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IntegrationPermissionEnum } from 'src/app/core/models/integration-permissions.enum';
import { IntegrationModel } from 'src/app/core/models/integration.model';
import { LocationModel } from 'src/app/core/models/location.model';
import { IntegrationService } from 'src/app/core/services/integration.service';
import { LocationService } from 'src/app/core/services/location.service';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { handleError } from 'src/app/shared/utils/error-handling.function';

const MAX_SCOPES = Object.keys(IntegrationPermissionEnum).length

@Component({
  selector: 'app-integration-add-edit',
  templateUrl: './integration-add-edit.component.html',
  styleUrls: ['./integration-add-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntegrationAddEditComponent implements OnInit {
  @ViewChild('stepper', { static: false }) matStepper : MatStepper;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  integrationForm: FormGroup;
  $locations: Observable<LocationModel[]> = this.locationService.list({});

  scopes: string[] = [];                             
  selectedIntegrationType: string;
  id: number;
  portId: string | null;
  integrationPermissionEnum = IntegrationPermissionEnum;
  

  constructor(private readonly fb: FormBuilder,
              private readonly translate: TranslateService,
              private readonly locationService: LocationService,
              private readonly integrationService: IntegrationService,
              private readonly organizationService: OrganizationService,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.integrationService.get(this.id).subscribe(response => {
        this.initForm(response);
        this.initializeScopes(response);
        this.isLoading$.next(false);
      })
    } else {
      this.initForm();
      this.isLoading$.next(false);
    }
  }

  private initializeScopes(integration: IntegrationModel): void {
    if (integration.scopes!.length === 0) {
      this.scopes = Object.keys(IntegrationPermissionEnum);
      return;
    }

    this.scopes = integration.scopes!;
  }

  initForm(integration: any = <IntegrationModel>{}): void {
    this.integrationForm = this.fb.group({
      // type: this.fb.control('', [requiredValidation(this.translate)]),
      name: this.fb.control(integration.name || '', [Validators.required]),
      // portId: this.fb.control(this.portId, [Validators.required]),
      locationId: this.fb.control(integration.targetEntity || null,),
      apiKey: this.fb.control({ disabled: true, value: '' }),
      partner: this.fb.control({ disabled: true, value: '' }),
      scopes: this.fb.control(integration.jsonData || this.scopes),
    })
  }

  selectIntegrationType(value: string): void {
    // this.integrationForm.get('type')?.patchValue(value, { emitEvent: false });
    this.selectedIntegrationType = value;
  }

  toggleScope(event: boolean, value: string): void {
    if (event === true && !this.scopes.includes(value)) {
      this.scopes.push(value)
    } else {
      this.scopes.splice(this.scopes.indexOf(value), 1);
    }
  }

  saveIntegration(): void {
    this.isLoading$.next(true);

    if (this.id) {
      this.integrationService.edit(this.id, this.parseData(this.integrationForm.getRawValue())).subscribe({
        next: () => {
          this.router.navigate(['../../success'], { relativeTo: this.route });
      }, error: (body) => {
        handleError(this.snackBar, body, this.isLoading$);
      }})
    } else {
      this.integrationService.create(this.parseData(this.integrationForm.getRawValue())).subscribe({
        next: () => {
          this.router.navigate(['../success'], { relativeTo: this.route });
        },
        error: (body) => {
          handleError(this.snackBar, body, this.isLoading$);
        }
      });
    }
  }

  private parseData(data: any) {
    return {
      name: data.name,
      portId: data.portId,
      scopes: this.scopes.length === MAX_SCOPES ? [] : this.scopes 
    }
  }
}
function requiredValidation(translate: TranslateService): import("@angular/forms").ValidatorFn {
  throw new Error('Function not implemented.');
}

