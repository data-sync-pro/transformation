import { Component, HostListener } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/breadcrumb/breadcrumb.component'; // adjust the path as needed

@Component({
  selector: 'app-function-page-main-layout',
  templateUrl: './function-page-main-layout.component.html',
  styleUrls: ['./function-page-main-layout.component.css']
})
export class FunctionPageMainLayoutComponent {
  isSearchOpen = false;
  isSidebarCollapsed = false;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Functions' }
  ];

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '');

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

  functionCategories = [
    {
      name: 'Date Functions',
      expanded: true,  
      functions: [
        { name: 'ADD_DAYS', route: 'add_days' },
        { name: 'AGG_COUNT_DISTINCT', route: 'agg_count_distinct' }
      ]
    },
    {
      name: 'Encoding Functions',
      expanded: false,
      functions: [
        { name: 'BASE64_ENCODE', route: 'base64_encode' },
        { name: 'BASE64_DECODE', route: 'base64_decode' }
      ]
    }
  ];
  
  toggleCategory(category: any) {
    category.expanded = !category.expanded;
  }
}
