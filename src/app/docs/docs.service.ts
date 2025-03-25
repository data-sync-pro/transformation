import { Injectable } from "@angular/core";
import docsData from "../../assets/data/functions.json";


interface Parameter {
    name: string;
    type: string;
    required: string;
    description: string;
  }

interface DocData {
    title: string;
    description: string;
    syntax: string;
    parameters?: Parameter[];
    examples?: string[];
    tips?: string[];
    relatedFormulas?: string[];
}

@Injectable({
    providedIn: 'root'
})

export class DocsService {
    private docs: { [key: string]: DocData } = docsData;
  
    constructor() {}
  
    getDocByName(docName: string): DocData | null {
      return this.docs[docName] || null;
    }
  
    getAllDocKeys(): string[] {
      return Object.keys(this.docs);
    }
  }