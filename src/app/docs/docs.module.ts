import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DocsRoutingModule } from './docs-routing.module';
import { DocViewerComponent } from './doc-viewer/doc-viewer.component';
import { HomeComponent } from '../pages/home/home.component';

@NgModule({
  declarations: [
    DocViewerComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DocsRoutingModule
  ]
})
export class DocsModule { }
