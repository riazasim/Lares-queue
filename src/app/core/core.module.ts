import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { setupFontAwesome } from './setup/font-awesome';
import { FaConfig, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BearerTokenInterceptor } from './interceptors/bearer-token.interceptor';
import { CREDENTIALS_CHECKER } from './guards/injection-tokens';
import { AuthService } from './services/auth.service';
import { RolesSecurityModule } from './pipes/roles-security.module';


@NgModule({
  imports: [
    CommonModule,
    RolesSecurityModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BearerTokenInterceptor,
      multi: true
    },
    {
      provide: CREDENTIALS_CHECKER,
      useExisting: AuthService
    }
  ]
})
export class CoreModule {
  constructor(faConfig: FaConfig, faLibrary: FaIconLibrary) {
    setupFontAwesome(faConfig, faLibrary);
  }
 }
