import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderOrchestratorService } from '../core/services/loader-orchestrator.service';
import { AssetsProviderService } from '../core/services/assets-provider.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicComponent {
  public readonly comvexLogoSrc: string;
  public readonly portalCoverImageSrc: string;
  public readonly showLoader$: Observable<boolean>;

  constructor(loaderService: LoaderOrchestratorService,
    assetsProvider: AssetsProviderService<string>) {
    this.comvexLogoSrc = assetsProvider.asset('images', 'login.png');
    this.portalCoverImageSrc = assetsProvider.asset(
      'images',
      'warehouse-trucks.jpg'
    );
    this.showLoader$ = loaderService.getLoaderStatus();
  }
 }
