import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreadcrumbItem } from 'src/app/shared/breadcrumb/breadcrumb.component';

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

  breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', link: '/' }];

  functionCategories: FunctionCategory[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Load the JSON file from the assets folder
    this.http.get<FunctionItem[]>('assets/data/tags.json').subscribe((data) => {
      this.groupFunctionsByTags(data);
      this.updateBreadcrumbs();
    });
    
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
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

  updateBreadcrumbs() {
    // Split the current URL to extract the function route.
    // For example, if URL is '/docs/add_days', then funcRoute is 'add_days'
    const urlParts = this.router.url.split('/');
    const funcRoute = urlParts[2];

    if (funcRoute) {
      let foundFunction: { name: string } | undefined;
      // Search through all function categories to find the function that matches the URL route.
      for (const category of this.functionCategories) {
        const match = category.functions.find((fn) => fn.route === funcRoute);
        if (match) {
          foundFunction = match;
          break;
        }
      }
      // If a matching function is found, update or add it as the second breadcrumb.
      if (foundFunction) {
        if (this.breadcrumbs.length === 1) {
          this.breadcrumbs.push({ label: foundFunction.name });
        } else {
          this.breadcrumbs[1] = { label: foundFunction.name };
        }
      } else {
        // If no matching function is found, remove any existing function breadcrumb.
        if (this.breadcrumbs.length > 1) {
          this.breadcrumbs.splice(1);
        }
      }
    } else {
      // If the URL does not contain a function route, ensure only the "Home" breadcrumb is present.
      if (this.breadcrumbs.length > 1) {
        this.breadcrumbs.splice(1);
      }
    }
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
