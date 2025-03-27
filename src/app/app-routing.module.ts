import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunctionPageMainLayoutComponent } from './layouts/function-page-main-layout/function-page-main-layout.component';
import { DocViewerComponent } from './docs/doc-viewer/doc-viewer.component';


const routes: Routes = [
  { path: '', redirectTo: 'docs/add_days', pathMatch: 'full' },
  {
    path: 'docs',
    component: FunctionPageMainLayoutComponent,
    children: [
      { path: ':docName', component: DocViewerComponent },
      { path: '', redirectTo: 'add_days', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
