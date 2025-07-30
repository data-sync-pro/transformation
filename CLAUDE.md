# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Common Commands
- `npm start` or `ng serve` - Start development server on http://localhost:4200
- `npm run build` - Build for production (outputs to `docs/` directory with base href `/`)
- `npm run watch` - Build in watch mode for development
- `npm test` or `ng test` - Run unit tests with Karma

### Angular CLI Commands
- `ng generate component component-name` - Generate new component
- `ng generate service service-name` - Generate new service

## Architecture Overview

### Core Concept
This is a documentation website for transformation formula functions. The app displays categorized functions with detailed documentation including syntax, parameters, examples, and related formulas.

### Data-Driven Architecture
- **Function Data**: Each function is defined in a JSON file in `src/assets/functions/` (e.g., `if.json`, `contains.json`)
- **Categorization**: `src/assets/data/tags.json` maps functions to categories like "Text", "Logical", "Date & Time"
- **Global Data**: `src/assets/data/` contains global variables, operators, and formula elements

### Key Services
- **DocsService**: Loads function documentation from JSON files, handles primary category lookup for functions
- **LayoutService**: Manages sidebar collapsed state using BehaviorSubject
- **SidebarService**: Handles sidebar navigation functionality

### Routing Structure
- Hash-based routing with lazy loading
- Main route: `/docs` loads the documentation module
- Function pages: `/docs/:docName` shows individual function documentation
- Home page: `/docs/home` shows categorized function overview

### Component Hierarchy
```
AppComponent (manages sidebar body class)
└── FunctionPageMainLayoutComponent
    ├── HeaderComponent
    ├── SidebarComponent
    ├── NavigationComponent
    └── Router Outlet
        ├── HomeComponent (function categories overview)
        └── DocViewerComponent (individual function docs)
```

### Data Flow Patterns
- Functions are categorized by tags, with primary category determined by first tag in tags.json
- Search functionality works across function names and descriptions
- Syntax highlighting uses highlight.js with custom shadow tag handling for code examples
- Navigation preserves active category context when moving between functions

### Build Configuration
- Production builds output to `docs/` directory for GitHub Pages hosting
- Uses hash routing for static hosting compatibility
- Custom base href `/` for custom domain deployment