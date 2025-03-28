import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-overlay',
  templateUrl: './search-overlay.component.html',
  styleUrls: ['./search-overlay.component.css'],
})
export class SearchOverlayComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  searchQuery: string = '';
  selectedTags: string[] = [];
  tags: string[] = [];
  suggestions: any[] = [];
  filteredSuggestions: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<any[]>('assets/data/tags.json').subscribe((data) => {
      this.suggestions = data.map((item) => ({
        name: item['Item Name'],
        Tags: item['Tags'],
        route: item['Item Name'].toLowerCase().replace(/\s+/g, '_'),
      }));

      const tagSet = new Set<string>();
      this.suggestions.forEach((item) =>
        item.Tags.forEach((tag: string) => tagSet.add(tag))
      );
      this.tags = Array.from(tagSet);
    });
  }

  onSelectSuggestion(item: any) {
    this.router.navigate(['/docs', item.route]);
    this.close();
  }

  toggleTag(tag: string) {
    const i = this.selectedTags.indexOf(tag);
    i >= 0 ? this.selectedTags.splice(i, 1) : this.selectedTags.push(tag);
    this.filterSuggestions();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedTags = [];
    this.filterSuggestions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      setTimeout(() => {
        this.searchInputRef?.nativeElement?.focus();
      }, 0);
    }
  }

  close() {
    this.closed.emit();
  }

  filterSuggestions() {
    const query = this.searchQuery.trim().toLowerCase();

    // Step 1: Find functions with names matching the query
    const nameMatches = this.suggestions.filter((item) =>
      item.name.toLowerCase().includes(query)
    );

    // Step 2: Collect all tags from name-matched items
    const relatedTags = new Set<string>();
    nameMatches.forEach((item) =>
      item.Tags.forEach((tag: string) => relatedTags.add(tag))
    );

    // Step 3: Filter all items that:
    // - Match by name OR
    // - Share any of the related tags
    // - AND match selected tags if any
    const matched = this.suggestions.filter((item) => {
      const itemTags = item.Tags || [];
      const isNameMatch = item.name.toLowerCase().includes(query);
      const sharesRelatedTag = itemTags.some((tag: string) =>
        relatedTags.has(tag)
      );
      const matchesSelectedTags =
        this.selectedTags.length === 0 ||
        this.selectedTags.every((tag: string) => itemTags.includes(tag));
      return (isNameMatch || sharesRelatedTag) && matchesSelectedTags;
    });

    // Step 4: Sort by how well the name matches
    matched.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aStarts = aName.startsWith(query);
      const bStarts = bName.startsWith(query);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // If both or neither start with it, sort by index of match
      return aName.indexOf(query) - bName.indexOf(query);
    });

    this.filteredSuggestions = matched;
  }
}
