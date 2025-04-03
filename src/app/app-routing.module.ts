import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunctionPageMainLayoutComponent } from './layouts/function-page-main-layout/function-page-main-layout.component';
import { DocViewerComponent } from './docs/doc-viewer/doc-viewer.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/docs', pathMatch: 'full' },
  {
    path: 'docs',
    component: FunctionPageMainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: ':docName', component: DocViewerComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
