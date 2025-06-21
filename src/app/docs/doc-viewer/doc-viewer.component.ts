import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocsService, DocData } from '../docs.service';
import hljs from 'highlight.js';
import { switchMap } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.css'],
})

export class DocViewerComponent implements OnInit {
  docContent: DocData | null = null;

  constructor(
    private route: ActivatedRoute,
    private docsService: DocsService,
    private sanitizer: DomSanitizer 
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const docName = params.get('docName');
          if (!docName){
            return [];
          }
          if (docName === 'global_variables') {
            return this.docsService.getGlobalVariables(); 
          }
          return this.docsService.getDocByName(docName);
        })
      )
      .subscribe(doc => {
        this.docContent = doc;
        setTimeout(() => {
          hljs.highlightAll();
        }, 0);
      })
  }

  highlightSql(raw: string): SafeHtml {

    const highlighted = hljs.highlight(raw, { language: 'sql' }).value
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
      
    const safe = this.sanitizer.sanitize(SecurityContext.HTML, highlighted) || '';

    return this.sanitizer.bypassSecurityTrustHtml(safe);
  }
}
