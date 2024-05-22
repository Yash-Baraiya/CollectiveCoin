import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { ItemsComponent } from './items/items.component';

@NgModule({
  declarations: [SidebarComponent, BarChartComponent, ItemsComponent],
  imports: [CommonModule, RouterModule, BsDatepickerModule],
  exports: [
    SidebarComponent,
    BsDatepickerModule,
    BarChartComponent,
    ItemsComponent,
  ],
})
export class SharedModule {}
