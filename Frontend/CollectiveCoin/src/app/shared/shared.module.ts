import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BarCartComponent } from '../bar-cart/bar-cart.component';
import { ItemsComponent } from './items/items.component';

@NgModule({
  declarations: [SidebarComponent, BarCartComponent, ItemsComponent],
  imports: [CommonModule, RouterModule, BsDatepickerModule],
  exports: [
    SidebarComponent,
    BsDatepickerModule,
    BarCartComponent,
    ItemsComponent,
  ],
})
export class SharedModule {}
