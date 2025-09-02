import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocsService, DocData, ExampleItem, DocImage } from '../../services/docs.service';
import hljs from 'highlight.js';

import { switchMap } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface ProcessedExample {
  code?: SafeHtml;
  images?: DocImage[];
}

@Component({
  selector: 'app-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.css'],
})
export class DocViewerComponent implements OnInit {
  docContent: DocData | null = null;
  processedExamples: ProcessedExample[] = [];
  highlightedDescriptionCode: SafeHtml | null = null;
  
  showImageViewer = false;
  selectedImageUrl = '';
  selectedImageAlt = '';
  private currentDocName: string | null = null; 
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
          this.currentDocName = docName;
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

        this.processedExamples = this.processExamples(doc?.examples ?? []);

        this.highlightedDescriptionCode = doc?.descriptionCode
          ? this.highlightDescriptionCode(doc.descriptionCode)
          : null;
      });

      setTimeout(() => {
        hljs.highlightAll();
      }, 0);
  }

  private processExamples(examples: (string | ExampleItem)[]): ProcessedExample[] {
    return examples.map(example => {
      if (typeof example === 'string') {
        return {
          code: this.highlightExamples(example)
        };
      } else {
        return {
          code: example.code ? this.highlightExamples(example.code) : undefined,
          images: example.images
        };
      }
    });
  }

  private highlightExamples(raw: string): SafeHtml {
    const tmp = raw
      .replace(/<shadow>/g, '§§SHD_START§§')
      .replace(/<\/shadow>/g, '§§SHD_END§§');

    const language = this.currentDocName === 'apex_class' ? 'java' : 'sql';
    const highlighted = hljs.highlight(tmp, { language }).value;

    const cleaned = highlighted
      .replace(/§§SHD_START§§/g, '<span class="code-comment">')
      .replace(/§§SHD_END§§/g, '</span>')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');

    return this.sanitizer.bypassSecurityTrustHtml(cleaned);
  }

  private highlightDescriptionCode(raw: string): SafeHtml {
    const language = this.currentDocName === 'apex_class' ? 'java' : 'sql';
    const highlighted = hljs.highlight(raw, { language }).value;
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
  
  getActiveCategory$(formula: string) {
    return this.docsService.getPrimaryCategory(formula);
  }

  openImageViewer(imageUrl: string, imageAlt?: string) {
    this.selectedImageUrl = imageUrl;
    this.selectedImageAlt = imageAlt || '';
    this.showImageViewer = true;
  }

  closeImageViewer() {
    this.showImageViewer = false;
    this.selectedImageUrl = '';
    this.selectedImageAlt = '';
  }

}
