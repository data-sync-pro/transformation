import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocViewerComponent } from './doc-viewer/doc-viewer.component';
import { HomeComponent } from '../pages/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // In-page sections (formerly /home#text, /home#formula-elements ...) now
  // live as path segments so URLs don't carry a fragment. HomeComponent reads
  // :section and scrolls the matching anchor.
  { path: 'home/:section', component: HomeComponent },
  // Backward-compat redirects for pre-rename special-page URLs. Must come
  // before the :docName catch-all so they win the match.
  { path: 'global_variables', redirectTo: 'global-variables', pathMatch: 'full' },
  { path: 'apex_class', redirectTo: 'apex-class', pathMatch: 'full' },
  { path: 'aggregate_general', redirectTo: 'aggregate-general', pathMatch: 'full' },
  { path: '$joiner', redirectTo: 'joiner', pathMatch: 'full' },
  // Canonical function URLs are category-prefixed: /text/char, /logical/if.
  // The two-segment match comes first; bare /:docName still works as a legacy
  // fallback that DocViewer upgrades to the canonical form when an
  // ?activeCategory= query param is present.
  { path: ':category/:docName', component: DocViewerComponent },
  { path: ':docName', component: DocViewerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocsRoutingModule { }
