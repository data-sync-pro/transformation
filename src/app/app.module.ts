import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FunctionPageMainLayoutComponent } from './layouts/function-page-main-layout/function-page-main-layout.component';
import { DocViewerComponent } from './docs/doc-viewer/doc-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    FunctionPageMainLayoutComponent,
    DocViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
