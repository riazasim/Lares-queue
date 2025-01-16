import { ChangeDetectionStrategy, Component, InjectionToken, Input } from '@angular/core';
import { USER_TYPE_ADMIN } from 'src/app/core/constants/roles.constant';
import { NavigationMenuConfig, Nullable } from 'src/app/core/models/navigation-menu.model';
import { RolesService } from 'src/app/core/services/roles.service';

export const USE_ROLES = new InjectionToken<boolean>('A value that controls if the navigation menu will use role based security or not');

@Component({
  selector: 'navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationMenuComponent {

  constructor(private readonly roleService: RolesService) {
  }

  @Input()
  public logoSrc: Nullable<string> = null;

  @Input()
  public logoRedirect: Nullable<string> = null;

  @Input()
  public upperMenuConfig: Nullable<NavigationMenuConfig[]> = null;

  @Input()
  public lowerMenuConfig: Nullable<NavigationMenuConfig[]> = null;

}
