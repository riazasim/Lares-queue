import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-no-products',
  templateUrl: './no-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoProductsComponent {

}
