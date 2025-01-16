import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsSuccessComponent } from './products-success/products-success.component';
import { ProductsAddEditComponent } from './products-add-edit/products-add-edit.component';


const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ProductsListComponent
      },
      {
        path: 'success',
        component: ProductsSuccessComponent
      },
      {
        path: 'add',
        component: ProductsAddEditComponent
      },
      {
        path: 'edit/:id',
        component: ProductsAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
