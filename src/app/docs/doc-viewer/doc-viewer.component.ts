import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocsService, DocData } from '../docs.service';
import hljs from 'highlight.js';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.css'],
})
export class DocViewerComponent implements OnInit {
  docContent: DocData | null = null;

  constructor(
    private route: ActivatedRoute,
    private docsService: DocsService
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
}
