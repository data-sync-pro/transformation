import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DocsService, DocData } from '../../services/docs.service';
interface FunctionTag {
  "Item Name": string;
  Tags: string[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tagsData: FunctionTag[] = [];
  itemsByTag: { [tag: string]: string[] } = {};
  uniqueTags: string[] = [];
  displayTags: string[] = [];
  functionDescriptions: { [funcName: string]: string } = {};
  formulaElements: any = null;


  globalVariables: { variable: string; description: string; }[] | undefined
  operators: { [category: string]: { operator: string; name: string; description: string }[] } | null = null;

  constructor(private router: Router, private http: HttpClient, private docsService: DocsService) {}

  async ngOnInit(): Promise<void> {
    this.loadTags();
    this.loadGlobalVariables();
    this.loadOperators();
    this.loadFormulaElements();

  }
  // Load tags.json and group functions by tag, skipping excluded tags
  loadTags() {
    const excludedTags = new Set(['Global Variables', 'Operators']);
    this.http.get<FunctionTag[]>('assets/data/tags.json').subscribe((data) => {
      this.tagsData = data;
      const tagSet = new Set<string>();

      data.forEach((item) => {
        item.Tags.forEach((tag) => {
          if (excludedTags.has(tag)) {
            return; // Skip tags that are excluded
          }
          tagSet.add(tag);
          if (!this.itemsByTag[tag]) {
            this.itemsByTag[tag] = [];
          }
          this.itemsByTag[tag].push(item["Item Name"]);
        });
      });

      Object.keys(this.itemsByTag).forEach(tag => {
        this.itemsByTag[tag].sort((a, b) => {
          const aDollar = a.startsWith('$');
          const bDollar = b.startsWith('$');
          if (aDollar && !bDollar) return 1;
          if (!aDollar && bDollar) return -1;
          return a.localeCompare(b);
        }
        );
        
      });

      const desiredOrder = [
        'Text',
        'Logical',
        'Number',
        'Date & Time',
        'Operators',
        'Global Variables',
        'Randomization',
        'Type Processing',
        'Trigger',
        'Advanced'
      ];

      this.displayTags = desiredOrder.filter(tag => {
        if (tag === 'Operators' || tag === 'Global Variables') {
          return true;
        }
        return tagSet.has(tag);
      });

      // Also build uniqueTags from tagSet for any other internal processing if needed
      this.uniqueTags = Array.from(tagSet); // if you need it, though displayTags is used for display

      this.loadFunctionDescriptions();
    });
  }


  // Dynamically load each function's description from its JSON file
  loadFunctionDescriptions() {
    this.tagsData.forEach(item => {
      const funcName = item["Item Name"];
      let fileName: string;

      if (funcName.trim().toLowerCase() === 'apex class') {
        fileName = funcName.toLowerCase() + '.json';
      } else {
        fileName = funcName.toLowerCase().replace(/\s/g, '_') + '.json';
      }

      const filePath = `assets/functions/${fileName}`;
      this.http.get<any>(filePath).subscribe(
        funcData => {
          if (funcName.trim().toLowerCase() === 'apex class') {
            const parser = new DOMParser();
            const doc = parser.parseFromString(funcData.description, 'text/html');
            const firstParagraph = doc.querySelector('p');
            this.functionDescriptions[funcName] = firstParagraph && firstParagraph.textContent ? firstParagraph.textContent.trim() : 'Description not available.';
          } else {
            this.functionDescriptions[funcName] = funcData.description;
          }
        },
        error => {
          this.functionDescriptions[funcName] = 'Description not available.';
        }
      );
    });
  }

  // Load Global Variables using the same style as the docs page
  loadGlobalVariables() {
    this.docsService.getGlobalVariables().subscribe((data: DocData) => {
      this.globalVariables = data.globalVariables;
    });
  }

  // Load Operators using the same style as the docs page
  loadOperators() {
    this.http.get<any>('assets/functions/operators.json').subscribe(data => {
      this.operators = data.operators;
    });
  }

    // Load Elements of a Formula from its JSON file
    loadFormulaElements() {
      this.http.get<any>('assets/data/elements_of_formula.json').subscribe((data) => {
        this.formulaElements = data;
      });
    }

  // Utility to get object keys for use in the template (for operators grouping)
  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  getAnchorId(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  goToFunction(funcName: string) {
    this.router.navigate(['/docs', funcName]);
  }
}