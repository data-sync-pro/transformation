import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocViewerComponent } from './doc-viewer/doc-viewer.component';
import { HomeComponent } from '../pages/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: ':docName', component: DocViewerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocsRoutingModule { }
