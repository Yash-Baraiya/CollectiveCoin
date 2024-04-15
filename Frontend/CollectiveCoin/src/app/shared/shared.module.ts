import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [SidebarComponent],
  imports: [CommonModule, RouterModule, BsDatepickerModule],
  exports: [SidebarComponent, BsDatepickerModule],
})
export class SharedModule {}
