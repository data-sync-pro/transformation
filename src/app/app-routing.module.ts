import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { FunctionPageMainLayoutComponent } from './layouts/function-page-main-layout/function-page-main-layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'docs', pathMatch: 'full' },
  {
    path: 'docs',
    component: FunctionPageMainLayoutComponent,
    loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
  },
  {
    path: 'editor',
    loadChildren: () => import('./editor/editor.module').then(m => m.EditorModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      useHash: false,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      preloadingStrategy: PreloadAllModules
    }
  )],
  exports: [RouterModule],
})
export class AppRoutingModule {}
