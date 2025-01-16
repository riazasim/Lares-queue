import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationModel } from '../core/models/organization.model';
import { AuthService } from '../core/services/auth.service';
import { OrganizationService } from '../core/services/organization.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { RolesService } from '../core/services/roles.service';
import { LoaderOrchestratorService } from '../core/services/loader-orchestrator.service';
import { LocationService } from '../core/services/location.service';
import { MatDialog } from '@angular/material/dialog';
import { LocationModel } from '../core/models/location.model';
import { NoLocationWarningComponent } from '../admin/no-location-warning/no-location-warning.component';
import { ChangeLocationModalComponent } from '../shared/components/change-location-modal/change-location-modal.component';

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html'
})
export class OperatorComponent {
  public readonly showLoader$: Observable<boolean>;
  notificationsCount: any;
  optionsTitle: string = 'Options';
  isMenuClosed: boolean = true
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  logoSrc: string = '';
  logoImgSrc: string = '';
  logoRedirect: string = '';
  currentLocation: string = '';
  companyName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  locationName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(public activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly roleService: RolesService,
    private readonly organizationService: OrganizationService,
    private readonly loaderService: LoaderOrchestratorService,
    private readonly locationService: LocationService,
    public readonly route: ActivatedRoute,
    private readonly dialogService: MatDialog,
    private router: Router) {
    this.showLoader$ = this.loaderService.getLoaderStatus();
  }
  ngOnInit(): void {
    this.checkLocation();
    this.subscribeForLocationChanges()
  }

  checkLocation(): void {
    this.organizationService.get().subscribe({
      next: (organization: any | null) => {
        this.companyName$.next(organization?.name || 'Transport');
        const temp: any = organization?.trasportModeSetting?.transportModeLogo;
        this.logoImgSrc = temp?.fullpath;
        if (!organization?.id || !organization.name) {
          this.locationService.getLocationsByUser().subscribe({
            next: (locations: LocationModel[]) => {
              if (!locations.length) {
                this.router.navigate(['locations', 'list'], { relativeTo: this.route.parent });
                this.isLoading$.next(false);
              } else if (locations.length === 1 && !this.locationName$.getValue()) {
                this.changeLocation(<number>locations[0].locationId);
              } else if (locations.length > 1 && !this.locationName$.getValue()) {
                this.openLocationSelectModal(locations);
              }
            },
            error: () => {
              this.isLoading$.next(false);
            }
          });
        } else {
          this.isLoading$.next(false);
        }
      },
      error: () => {
        this.isLoading$.next(false);
      }
    });
  }

  changeLocation(id: number): void {
    this.locationService.changeLocation(id).subscribe({
      next: (location: LocationModel) => {
        this.locationName$.next(location.name);
        this.isLoading$.next(false);
      },
      error: (body) => { }
    })
  }

  subscribeForLocationChanges() {
    this.organizationService.organization.subscribe((response: OrganizationModel | null) => {
      if (response) {
        this.locationName$.next(response.locationName)
      }
    })
  }

  openLocationWarningModal(): void {
    this.dialogService.open(NoLocationWarningComponent, {
      disableClose: true,
    }).afterClosed()
      .subscribe({ next: () => { } });
  }

  openLocationSelectModal(locations: LocationModel[]): void {
    // console.log('Opening Location Select Modal with locations:', locations); // Add this line
    if (locations.length === 0) {
      console.warn('No locations available to select.');
      return;
    }
    this.dialogService.open(ChangeLocationModalComponent, {
      disableClose: true,
      data: {
        locations
      }
    }).afterClosed()
      .subscribe({
        next: (id) => {
          this.changeLocation(id);
        }
      });
  }

  logout(): void {
    this.isLoading$.next(true)
    this.authService.logout().subscribe(() => {
      this.authService.removeAuth();
      this.roleService.removeUserRoles();
      this.router.navigate(['/']);
      this.isLoading$.next(false)
    });
  }
}
