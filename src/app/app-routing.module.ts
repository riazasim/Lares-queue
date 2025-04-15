import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { LocalizeRouterModule, LocalizeParser, LocalizeRouterSettings, CacheMechanism } from '@gilsdav/ngx-translate-router';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { translateFactory } from './core/factories/translate.factory';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    },
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: environment.useHash,
            onSameUrlNavigation: 'reload',
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
        }),
        LocalizeRouterModule.forRoot(routes, {
            parser: {
                provide: LocalizeParser,
                useFactory: translateFactory,
                deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient],
            },
            cacheMechanism: CacheMechanism.Cookie,
            cookieFormat: '{{value}};{{expires:20}};path=/',
            alwaysSetPrefix: true
        }),
    ],
    exports: [RouterModule, LocalizeRouterModule]
})
export class AppRoutingModule{

}
