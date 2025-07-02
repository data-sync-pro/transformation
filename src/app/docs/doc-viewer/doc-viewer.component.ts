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
  highlightedExamples: SafeHtml[] = [];
  highlightedDescriptionCode: SafeHtml | null = null; 
  constructor(
    private route: ActivatedRoute,
    private docsService: DocsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const docName = params.get('docName');
          if (!docName) {
            return [];
          }
          if (docName === 'global_variables') {
            return this.docsService.getGlobalVariables();
          }
          return this.docsService.getDocByName(docName);
        })
      )
      .subscribe((doc) => {
        this.docContent = doc;

        this.highlightedExamples = (doc?.examples ?? []).map((ex) =>
          this.highlightExamples(ex)
        );

        this.highlightedDescriptionCode = doc?.descriptionCode
          ? this.highlightDescriptionCode(doc.descriptionCode)
          : null;
      });

      setTimeout(() => {
        hljs.highlightAll();
      }, 0);
  }

  private highlightExamples(raw: string): SafeHtml {
    const tmp = raw
      .replace(/<shadow>/g, '§§SHD_START§§')
      .replace(/<\/shadow>/g, '§§SHD_END§§');

    const highlighted = hljs.highlight(tmp, { language: 'sql' }).value;

    const cleaned = highlighted
      .replace(/§§SHD_START§§/g, '<span class="code-comment">')
      .replace(/§§SHD_END§§/g, '</span>')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');

    return this.sanitizer.bypassSecurityTrustHtml(cleaned);
  }

  private highlightDescriptionCode(raw: string): SafeHtml {
    const highlighted = hljs.highlight(raw, { language: 'sql' }).value;
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

}
