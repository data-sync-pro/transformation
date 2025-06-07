import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { BreadcrumbItem } from 'src/app/shared/breadcrumb/breadcrumb.component';
import { Subject, Subscription } from 'rxjs';
import { SidebarService } from 'src/app/services/sidebar.service';
import { buildRoute } from 'src/app/utils/route.util';
import { LayoutService } from '../../services/layout.service';

interface FunctionItem {
  'Item Name': string;
  Tags: string[];
}

interface FunctionCategory {
  name: string;
  expanded: boolean;
  functions: { name: string; route: string }[];
}
const SPECIAL_ROUTES: Record<string, string> = {
  Home: 'home',   
  Operators: 'operators',
  'Global Variables': 'global_variables',
  'Apex Class': 'apex_class',
};
@Component({
  selector: 'app-function-page-main-layout',
  templateUrl: './function-page-main-layout.component.html',
  styleUrls: ['./function-page-main-layout.component.css'],
})
export class FunctionPageMainLayoutComponent implements OnInit, OnDestroy {
  isSearchOpen = false;
  collapsed$ = this.layout.collapsed$;
  private destroy$ = new Subject<void>();
  showSidebar = false;
  operatorExpand = false;
  globalVariableExpand = false;
  apexClassExpand = false;
  //breadcrumbs: BreadcrumbItem[] = [{ label: 'HOME', link: '/' }];

  functionCategories: FunctionCategory[] = [];
  routerSubscription!: Subscription;
  constructor(
    private http: HttpClient,
    public router: Router,
    private route: ActivatedRoute,
    private sidebarService: SidebarService,
    private layout: LayoutService
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['activeCategory']) {
          this.sidebarService.setActiveCategory(params['activeCategory']);
        }
      });

    this.http.get<FunctionItem[]>('assets/data/tags.json').subscribe((data) => {
      this.groupFunctionsByTags(data);
      //this.updateBreadcrumbs();
      this.updateActiveCategory();
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        //this.updateBreadcrumbs();
        this.updateActiveCategory();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  groupFunctionsByTags(functionItems: FunctionItem[]) {
    const tagMap: { [tag: string]: { name: string; route: string }[] } = {};

    functionItems.forEach((item) => {
      item.Tags.forEach((tag) => {
        if (!tagMap[tag]) {
          tagMap[tag] = [];
        }
        // Create a route based on the function name
        tagMap[tag].push({
          name: item['Item Name'],
          route: buildRoute(item['Item Name']),
        });
      });
    });

    this.functionCategories = Object.keys(tagMap).map((tag) => ({
      name: tag,
      expanded: false,
      functions: tagMap[tag].sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aDollar = aName.startsWith('$');
        const bDollar = bName.startsWith('$');
        if (aDollar && !bDollar) return 1;
        if (!aDollar && bDollar) return -1;

        return aName.localeCompare(bName);
      }),
    }));

    const TAG_ORDER = [
      'Text',
      'Logical',
      'Number',
      'Date & Time',
      'Operators',
      'Global Variables',
      'Randomization',
      'Type Processing',
      'Trigger',
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

     this.functionCategories.unshift({
      name: 'Home',
      expanded: false,
      functions: [],
    });
  }

  // updateBreadcrumbs() {
  //   // Extract the function route from the URL (e.g., '/docs/add_days')
  //   const urlParts = this.router.url.split('/');
  //   const funcRoute = urlParts[2].split('?')[0]; // Get the route part before any query params

  //   let functionName = '';
  //   console.log('Function Route:', funcRoute);
  //   if (funcRoute) {
  //     if (funcRoute === 'global_variables') {
  //       functionName = 'Global Variables';
  //     } else if (funcRoute === 'apex_class') {
  //       functionName = 'Apex Class';
  //     } else if (funcRoute === 'aggregate_general') {
  //       functionName = 'Aggregate General';
  //     } else {
  //       // Loop through your function categories to find the matching function.
  //       for (const category of this.functionCategories) {
  //         const match = category.functions.find((fn) => fn.route === funcRoute);
  //         if (match) {
  //           functionName = match.name;
  //           break;
  //         }
  //       }
  //     }
  //   }
  //   // Update the breadcrumb:
  //   // If a function name is found, add or update the second breadcrumb.
  //   if (functionName) {
  //     if (this.breadcrumbs.length === 1) {
  //       this.breadcrumbs.push({ label: functionName });
  //     } else {
  //       this.breadcrumbs[1] = { label: functionName };
  //     }
  //   } else {
  //     // If no matching function is found, remove any existing function breadcrumb.
  //     if (this.breadcrumbs.length > 1) {
  //       this.breadcrumbs.splice(1);
  //     }
  //   }
  // }

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

  toggleCategory(category: FunctionCategory): void {
    const target = SPECIAL_ROUTES[category.name];
    console.log('Toggling category:', category.name, 'Target route:', target);
    if (target) {
      this.sidebarService.setActiveCategory('');
      category.expanded = true;
      this.router.navigate(['/docs', target]);
      return;
    }

    category.expanded = !category.expanded;
  }

  toggleSidebar() {
    this.layout.toggle();
  }

  closeSidebar() {
    this.showSidebar = false;
  }

  updateActiveCategory() {
    const urlSegments = this.router.url.split('/');
    console.log('URL Segments:', urlSegments);
    const activeRoute = urlSegments[2];
    console.log('Active Route:', activeRoute);
    this.sidebarService.activeCategory$
      .pipe(takeUntil(this.destroy$))
      .subscribe((activeCategory) => {
        this.functionCategories.forEach((category) => {
          if (category.name === 'Home') {
            category.expanded = activeRoute === '' || activeRoute === 'home';
          } else if (category.name === 'Operators') {
            this.operatorExpand = activeRoute === 'operators';
          } else if (category.name === 'Global Variables') {
            this.globalVariableExpand = activeRoute === 'global_variables';
          } else if (category.name === 'Apex Class') {
            this.apexClassExpand = activeRoute === 'apex_class';
          } else {
            if (activeCategory) {
              category.expanded = category.name === activeCategory;
            } else {
              category.expanded = category.functions.some(
                (fn) => fn.route === activeRoute
              );
            }
          }
        });
      });
  }
}
