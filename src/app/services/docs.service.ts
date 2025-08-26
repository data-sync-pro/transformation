import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, shareReplay } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Parameter {
  name: string;
  type: string;
  required: string;
  description: string;
}

export interface DocImage {
  src: string;
  alt?: string;
}

export interface ExampleItem {
  code?: string;
  images?: DocImage[];
}

export interface DocData {
  title: string;
  description?: string;
  descriptionImages?: DocImage[];
  descriptionCode?: string;
  syntax?: string;
  parameters?: Parameter[];
  examples?: (string | ExampleItem)[];
  tips?: string[];
  relatedFormulas?: string[];
  operators?: {
    [category: string]: {
      operator: string;
      name: string;
      description: string;
    }[];
  };
  globalVariables?: {
    variable: string;
    description: string;
  }[];
}

interface TagItem {
  'Item Name': string;
  Tags: string[];
}

@Injectable({
  providedIn: 'root',
})
export class DocsService {
  constructor(private http: HttpClient) {}

  getDocByName(docName: string): Observable<DocData | null> {
    const url = `assets/functions/${docName}.json`;
    return this.http.get<DocData>(url).pipe(
      catchError((error) => {
        console.error(`Error loading ${url}:`, error);
        return of(null);
      })
    );
  }

  getGlobalVariables(): Observable<DocData> {
    return this.http.get<DocData>('assets/data/global_variables.json');
  }

  private readonly tagMap$: Observable<Map<string, string>> = this.http
    .get<TagItem[]>('assets/data/tags.json') 
    .pipe(
      map((list) => {
        const m = new Map<string, string>();
        list.forEach((item) => {
          if (item.Tags?.length) {
            m.set(item['Item Name'].toUpperCase(), item.Tags[0]); 
          }
        });
        return m;
      }),
      shareReplay(1),
      catchError((err) => {
        console.error('Error loading tag.json', err);
        return of(new Map()); 
      })
    );
  getPrimaryCategory(formula: string): Observable<string | null> {
    return this.tagMap$.pipe(
      map((mapObj) => mapObj.get(formula.toUpperCase()) ?? null)
    );
  }
}
