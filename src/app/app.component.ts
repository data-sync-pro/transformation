import { Component, Inject, OnDestroy, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { LayoutService } from './services/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'dsp-function-documentation';

  private sub: Subscription;

  constructor(
    private layout: LayoutService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.sub = this.layout.collapsed$.subscribe((collapsed) => {
      if (collapsed) {
        this.renderer.addClass(this.doc.body, 'sidebar-collapsed');
      } else {
        this.renderer.removeClass(this.doc.body, 'sidebar-collapsed');
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe(); 
  }
}
