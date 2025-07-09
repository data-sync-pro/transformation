import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FunctionPageMainLayoutComponent } from './function-page-main-layout/function-page-main-layout.component';
import { SearchOverlayComponent } from './search-overlay/search-overlay.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    FunctionPageMainLayoutComponent,
    SearchOverlayComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    FunctionPageMainLayoutComponent,
    SearchOverlayComponent
  ]
})
export class LayoutsModule { }
