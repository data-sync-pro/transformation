# Transformation

A comprehensive documentation website for transformation formula functions. This Angular application provides categorized functions with detailed documentation including syntax, parameters, examples, and related formulas.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.11.

## Features

- **Function Documentation**: Comprehensive documentation for transformation formula functions
- **Categorized Functions**: Functions organized by categories (Text, Logical, Date & Time, etc.)
- **Interactive Examples**: Syntax highlighting with detailed examples for each function
- **Search Functionality**: Search across function names and descriptions
- **Responsive Design**: Mobile-friendly interface with collapsible sidebar

## Architecture

### Data-Driven Approach
- Functions defined in JSON files under `src/assets/functions/`
- Categories mapped in `src/assets/data/tags.json`
- Global variables and operators in `src/assets/data/`

### Key Components
- **DocsService**: Loads and manages function documentation
- **HomeComponent**: Displays categorized function overview
- **DocViewerComponent**: Shows individual function documentation
- **SidebarComponent**: Navigation with search functionality

## Development Commands

### Development Server
Run `npm start` or `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build
Run `npm run build` to build the project for production. The build artifacts are stored in the `docs/` directory for GitHub Pages deployment.

### Testing
Run `npm test` or `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Watch Mode
Run `npm run watch` to build in watch mode for development.

## Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
