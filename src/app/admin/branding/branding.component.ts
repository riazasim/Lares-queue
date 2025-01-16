import {ChangeDetectionStrategy, OnInit, Component, NgModule} from '@angular/core';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrganizationModel } from 'src/app/core/models/organization.model';
import { LocationService } from 'src/app/core/services/location.service';
import { OrganizationService } from 'src/app/core/services/organization.service';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LocationModel, LocationTable} from 'src/app/core/models/location.model';
import { handleError } from 'src/app/shared/utils/error-handling.function';


@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BrandingComponent implements OnInit {

    modeLogo: string; 
    imgLogo: string;
    imgCover: string;

  isChangedImgLogo: boolean = false;
  isChangedImgCover: boolean = false;
  imgCoverFile: File | null;
  imgLogoFile: File | null;
  modeLogoFile: File | null;
  organization$: BehaviorSubject<OrganizationModel|null> = new BehaviorSubject<OrganizationModel|null>(null);
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  privacyLink = new FormControl('');
  companyName = new FormControl('');
  bookingFormActivation = new FormControl();
  origin: string;
  locations: LocationModel[] = [];
  constructor(private readonly snackBar: MatSnackBar,
              private organizationService: OrganizationService,
              private readonly locationService: LocationService,
              public readonly translateService: TranslateService) {}

  ngOnInit(): void {
    // this.locationService.list({}).subscribe((response: LocationModel[]) => {
    //   this.locations = response;
    //   this.retrieveOrganization();
    //   this.origin = location?.origin;
    // })
      let data={
          "start": 0,
          "length": 0,
          "filters": ["","","","","",""],//["firstname/lastname", "status", "role", "phone", "email"]
          "order": [{"dir": "DESC", "column": 0}]
      }

      this.locationService.pagination(data).subscribe((response: LocationTable) => {
         // this.locations = response;
          this.retrieveOrganization();
          this.origin = location?.origin;
      })
  }

  retrieveLocations(): Observable<LocationModel[]> {
    return this.locationService.list({});
  }

  retrieveOrganization(): void {
    this.organizationService.get().subscribe((response: OrganizationModel|null) => {
      this.organization$.next(response);
      this.imgCover = <string>response?.imgCover;
      this.imgLogo = <string>response?.imgLogo;
      this.companyName.setValue(<string>response?.name);
      this.bookingFormActivation.setValue(response?.bookingFormIsActivated);
      this.privacyLink.setValue(<string>response?.privacyLink);
      this.isLoading$.next(false);
    })
  }

  loadImage(target: any, type: 'imgCover' | 'imgLogo'): void {
    this.isLoading$.next(true);
    if (target.files.item(0)) {
      if (type === 'imgCover') {
        this.imgCoverFile = target.files.item(0);
      }
      if (type === 'imgLogo') {
        this.imgLogoFile = target.files.item(0);
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          if (type === 'imgLogo' && (img.height > 500 || img.width > 500)) {
            this.imgCoverFile = null;
            this.imgLogoFile = null;
            this.clear(type);
            this.snackBar.open("The image should have a maximum of 500x500 px width and height!", "Warning", {
              duration: 3000,
              horizontalPosition: 'center',
              panelClass: ['error-snackbar'],
              verticalPosition: 'top',
            });
            this.isLoading$.next(false);
            return;
          }
          if (type === 'imgCover') this.isChangedImgCover = true;
          if (type === 'imgLogo') this.isChangedImgLogo = true;
          this[type] = e.target.result;
          this.isLoading$.next(false);
        }
      }
      reader.readAsDataURL(target.files[0]);
    }
  }

  triggerFile(btn: any, file: any): void {
    btn.blur();
    file.click();
  }

  setImage(image: any, type: 'imgCover' | 'imgLogo'): void {
    if (image) {
      const reader = new FileReader();
        reader.onload = (e: any) => {
            this[type] = e.target.result;
        }
        if (/(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg)$/.test(image)) {
          reader.readAsDataURL(image);
        }
    }
  }

  submit(): void {
    this.isLoading$.next(true);
    this.organizationService.update(<number>this.organization$.getValue()?.id, {
      name: this.companyName.value,
      privacyLink: this.privacyLink.value,
      bookingFormIsActivated: this.bookingFormActivation.value,
      imgLogoFile: this.imgLogoFile,
      imgCoverFile: this.imgCoverFile
    }).subscribe({
      next: (response) => {
        this.setOrganization(response);
        this.snackBar.open('Branding updated successfully!', 'Success', {
          duration: 3000,
          horizontalPosition: 'center',
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
        })
        this.isLoading$.next(false);
      },
      error: (body) => {
        handleError(this.snackBar, body, this.isLoading$);
      }
    });
  }

  uploadFile(file: any, type: 'imgCover' | 'imgLogo'): void {
    this.isLoading$.next(true);
    if (this.organization$.getValue()?.id &&
        (this.isChangedImgCover || this.isChangedImgLogo) &&
        (type === 'imgCover' && this.imgCoverFile || type === 'imgLogo' && this.imgLogoFile)) {
      if (type === 'imgCover') {
        this.updateImgCover(file, <File>this.imgCoverFile);
      }
      if (type === 'imgLogo') {
        this.updateImgLogo(file, <File>this.imgLogoFile);
      }
    }
  }

  updateImgCover(fileReference:any, f: File): void {
    this.organizationService.updateCover(<number>(<OrganizationModel>this.organization$.getValue()).id, f).subscribe({
      next: (response: OrganizationModel) => {
        this.organization$.next(response);
        this.imgCover = <string>response?.imgCover;
        this.snackBar.open('', 'Success', {
          duration: 3000,
          horizontalPosition: 'center',
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
        })
        this.isLoading$.next(false);
      },
      error: (body: any) => {
        fileReference.value = '';
        this.isChangedImgCover = false;
        this.imgCoverFile = null;
        this.imgLogoFile = null;
        this.clear('imgCover');
        handleError(this.snackBar, body, this.isLoading$)
      }
    });
  }

  updateImgLogo(fileReference:any, f: File): void {
    this.organizationService.updateLogo(<number>(<OrganizationModel>this.organization$.getValue()).id, f).subscribe({
      next: (response: OrganizationModel) => {
        this.organization$.next(response);
        this.imgLogo = <string>response?.imgLogo;
        this.snackBar.open('', 'Success', {
          duration: 3000,
          horizontalPosition: 'center',
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
        })
        this.isLoading$.next(false);
      },
      error: (body: any) => {
        fileReference.value = '';
        this.isChangedImgLogo = false;
        this.imgCoverFile = null;
        this.imgLogoFile = null;
        this.clear('imgLogo');
        handleError(this.snackBar, body, this.isLoading$)
      }
    });
  }
  updateAppModeLogo(fileReference:any, f: File): void {
    this.organizationService.setTransportModeDetails(<number>(<any>this.organization$.getValue()).id, f).subscribe({
      next: (response: any) => {
        this.organization$.next(response);
        this.modeLogo = <string>response?.trasportModeSetting?.transportModeLogo;
        this.snackBar.open('', 'Success', {
          duration: 3000,
          horizontalPosition: 'center',
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
        })
        this.isLoading$.next(false);
      },
      error: (body: any) => {
        fileReference.value = '';
        this.isChangedImgLogo = false;
        this.imgCoverFile = null;
        this.imgLogoFile = null;
        this.modeLogoFile = null;
        this.clear('modeLogo');
        handleError(this.snackBar, body, this.isLoading$)
      }
    });
  }

  private clear(type: 'imgCover' |'imgLogo' | 'modeLogo'): void {
    if (type === 'imgCover') this.imgCover = '';
    if (type === 'imgLogo') this.imgLogo = '';
    if (type === 'modeLogo') this.modeLogo = '';
  }

  private setOrganization(organization: OrganizationModel): void {
    this.organization$.next(organization);
    this.imgCover = <string>organization?.imgCover;
    this.imgLogo = <string>organization?.imgLogo;
    this.companyName.setValue(<string>organization?.name);
    this.bookingFormActivation.setValue(organization?.bookingFormIsActivated);
    this.privacyLink.setValue(<string>organization?.privacyLink);
  }
}
