import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocationSettingsModel } from 'src/app/core/models/location-settings.model';
import { RolesService } from 'src/app/core/services/roles.service';

@Component({
    selector: 'app-location-settings',
    templateUrl: './location-settings.component.html',
    styleUrls: ['./location-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSettingsComponent {
    userRole: string;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false)
    constructor(private readonly roleService: RolesService) {
        this.getUser()
    }
    getUser() {
        this.userRole = this.roleService.getAuthRoles();
    }
    search: string;
    general: LocationSettingsModel[] = [{
        name: 'Fleet',
        link: '../fleet'
    }, {
        name: 'Operations',
        link: '../operations'
    }, {
        name: 'Locations',
        link: '../locations'
    },
    //  {
    //   name: 'Stations',
    //   link: '../stations'
    // },
     {
      name: 'Branding',
      link: '../branding'
    },
     {
      name: 'Integration',
      link: '../integrations'
    },
     {
      name: 'Products',
      link: '../products'
    },
    //  {
    //   name: 'Partners\' contacts',
    //   link: '../partners-contacts'
    // },
    {
        name: 'Notifications⚠️',
        link: '../notifications'
    }
    ]
    operations: LocationSettingsModel[] = [{
        name: 'Custom fields',
        link: '../custom-fields'
    }, {
        name: 'Message templates',
        link: '../message-templates'
    }, {
        name: 'SMS automation',
        link: '../message-automations'
    }, {
        name: 'Report builder ⚠️',
        link: null
    }, {
        name: 'Alerts⚠️',
        link: null
    }
    ]
    reports: LocationSettingsModel[] = [{
        name: 'API documentation⚠️',
        link: null
    }, {
        name: 'Lares Access Integration⚠️',
        link: null
    }, {
        name: 'SMS integration⚠️',
        link: null
    }, {
        name: 'Custom integration⚠️',
        link: null
    }, {
        name: 'Watchlist⚠️',
        link: null
    }]

    developers: LocationSettingsModel[] = [
        {
            name: 'API documentation⚠️',
            link: null
        }, {
            name: 'SMS Integration⚠️',
            link: null
        }, {
            name: 'Yard Access Integration⚠️',
            link: null
        }, {
            name: 'Access Managenent Integration⚠️',
            link: null
        }, {
            name: 'Custom Integration⚠️',
            link: null
        }, {
            name: 'Webhooks⚠️',
            link: null
        }
    ]
}
