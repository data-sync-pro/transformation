import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface FunctionItem {
  'Item Name': string;
  Tags: string[];
}

interface FunctionCategory {
  name: string;
  expanded: boolean;
  functions: { name: string; route: string }[];
}

@Component({
  selector: 'app-function-page-main-layout',
  templateUrl: './function-page-main-layout.component.html',
  styleUrls: ['./function-page-main-layout.component.css'],
})
export class FunctionPageMainLayoutComponent implements OnInit {
  isSearchOpen = false;
  isSidebarCollapsed = false;

  functionCategories: FunctionCategory[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Load the JSON file from the assets folder
    this.http.get<FunctionItem[]>('assets/data/tags.json').subscribe((data) => {
      this.groupFunctionsByTags(data);
    });
  }

  groupFunctionsByTags(functionItems: FunctionItem[]) {
    // Create a map to hold tag groups
    const tagMap: { [tag: string]: { name: string; route: string }[] } = {};

    functionItems.forEach((item) => {
      item.Tags.forEach((tag) => {
        if (!tagMap[tag]) {
          tagMap[tag] = [];
        }
        // Create a route based on the function name
        tagMap[tag].push({
          name: item['Item Name'],
          route: item['Item Name'].toLowerCase(),
        });
      });
    });

    // Transform the map into an array for the sidebar
    this.functionCategories = Object.keys(tagMap).map((tag) => ({
      name: tag,
      expanded: false, // You can set default expanded state here
      functions: tagMap[tag],
    }));

    const TAG_ORDER = [
      'Date & Time',
      'Time',
      'Text',
      'Number',
      'Logical',
      'Trigger',
      'Type Processing',
      'Randomization',
      'Operators',
      'Global Variable',
      'Advanced',
    ];

    this.functionCategories.sort((a, b) => {
      const indexA = TAG_ORDER.indexOf(a.name);
      const indexB = TAG_ORDER.indexOf(b.name);
      return (
        (indexA === -1 ? Infinity : indexA) -
        (indexB === -1 ? Infinity : indexB)
      );
    });
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const isInputFocused = ['INPUT', 'TEXTAREA'].includes(
      document.activeElement?.tagName || ''
    );

    if (event.key === '/' && !isInputFocused) {
      event.preventDefault();
      this.isSearchOpen = true;
    }

    if (event.key === 'Escape') {
      this.isSearchOpen = false;
    }
  }

  openSearch() {
    this.isSearchOpen = true;
  }

  closeSearch() {
    this.isSearchOpen = false;
  }

  toggleCategory(category: any) {
    category.expanded = !category.expanded;
  }

 
}
