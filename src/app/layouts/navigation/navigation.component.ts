import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject, Subscription, Observable } from 'rxjs';
import { SidebarService } from 'src/app/services/sidebar.service';
import { buildRoute } from 'src/app/utils/route.util';

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
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  @Input() collapsed$!: Observable<boolean>;
  @Output() searchOpen = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  operatorExpand = false;
  globalVariableExpand = false;
  apexClassExpand = false;
  functionCategories: FunctionCategory[] = [];
  routerSubscription!: Subscription;

  constructor(
    private http: HttpClient,
    public router: Router,
    private route: ActivatedRoute,
    private sidebarService: SidebarService
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
      this.updateActiveCategory();
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
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

  onSearchClick(): void {
    this.searchOpen.emit();
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  groupFunctionsByTags(functionItems: FunctionItem[]) {
    const tagMap: { [tag: string]: { name: string; route: string }[] } = {};

    functionItems.forEach((item) => {
      item.Tags.forEach((tag) => {
        if (!tagMap[tag]) {
          tagMap[tag] = [];
        }
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
      'Text', 'Logical', 'Number', 'Date & Time', 'Operators',
      'Global Variables', 'Randomization', 'Type Processing', 'Trigger', 'Advanced',
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

  toggleCategory(category: FunctionCategory): void {
    const target = SPECIAL_ROUTES[category.name];
    if (target) {
      this.sidebarService.setActiveCategory('');
      category.expanded = true;
      this.router.navigate(['/docs', target]);
      return;
    }
    category.expanded = !category.expanded;
  }

  updateActiveCategory() {
    const urlSegments = this.router.url.split('/');
    const activeRoute = urlSegments[2];
    const isDollarVar = activeRoute?.startsWith('$');

    this.sidebarService.activeCategory$
      .pipe(takeUntil(this.destroy$))
      .subscribe((activeCategory) => {
        this.functionCategories.forEach((category) => {
          if (category.name === 'Home') {
            category.expanded = activeRoute === '' || activeRoute === 'home';
          } else if (category.name === 'Operators') {
            this.operatorExpand = activeRoute === 'operators';
          } else if (category.name === 'Global Variables') {
            this.globalVariableExpand = activeRoute === 'global_variables' ||
              isDollarVar ||
              activeCategory === 'Global Variables';
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
