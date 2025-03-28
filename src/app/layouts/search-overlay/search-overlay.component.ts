import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-overlay',
  templateUrl: './search-overlay.component.html',
  styleUrls: ['./search-overlay.component.css'],
})
export class SearchOverlayComponent implements OnInit {
  searchQuery: string = '';
  selectedCategories: string[] = [];
  selectedTags: string[] = [];
  //categories: string[] = [];
  tags: string[] = [];
  suggestions: any[] = [];
  filteredSuggestions: any[] = [];

  @Output() closed = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('assets/data/tags.json').subscribe((data) => {
      this.suggestions = data.map((item) => ({
        name: item['Item Name'],
        Tags: item['Tags'],
      }));
      // this.filteredSuggestions = [...this.suggestions];

      // Extract unique categories and tags
      const tagSet = new Set<string>();
      this.suggestions.forEach((item) =>
        item.Tags.forEach((tag: string) => tagSet.add(tag))
      );
      this.tags = Array.from(tagSet);
      //this.categories = this.tags;
    });
  }

  // toggleCategory(category: string) {
  //   const i = this.selectedCategories.indexOf(category);
  //   i >= 0
  //     ? this.selectedCategories.splice(i, 1)
  //     : this.selectedCategories.push(category);
  //   this.filterSuggestions();
  // }

  toggleTag(tag: string) {
    const i = this.selectedTags.indexOf(tag);
    i >= 0 ? this.selectedTags.splice(i, 1) : this.selectedTags.push(tag);
    this.filterSuggestions();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategories = [];
    this.selectedTags = [];
    this.filterSuggestions();
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
