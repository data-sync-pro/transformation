import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocsService } from '../docs.service';

@Component({
  selector: 'app-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.css']
})
export class DocViewerComponent implements OnInit {
  docName: string | null = null;
  docContent: any;

  constructor(
    private route: ActivatedRoute,
    private docsService: DocsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const docName = params.get('docName');
      if (docName) {
        this.docContent = this.docsService.getDocByName(docName);
      }
    });
  }
}
