import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ItemsComponent } from './items/items.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SidebarComponent, ItemsComponent],
  imports: [
    CommonModule,
    RouterModule,
    BsDatepickerModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    SidebarComponent,
    BsDatepickerModule,
    ItemsComponent,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
