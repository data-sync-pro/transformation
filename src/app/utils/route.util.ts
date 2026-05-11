
// Pseudo-function entries in tags.json / global-variables.json whose URL slug
// is a category/special page rather than a real function identifier. These
// follow URL kebab-case convention instead of mirroring the underscored
// identifier the way actual function names (e.g. ADD_DAYS -> add_days) do.
const SPECIAL_SLUGS: Record<string, string> = {
  GLOBAL_VARIABLES: 'global-variables',
  APEX_CLASS: 'apex-class',
  '$JOINER': 'joiner',
};

export const buildRoute = (name: string): string => {
  const upper = name.toUpperCase();
  if (SPECIAL_SLUGS[upper]) return SPECIAL_SLUGS[upper];
  return name.toLowerCase().replace(/\s+/g, '_');
};

// All tag categories present in tags.json. Used to build the slug<->name map
// so route segments like /text/char can be parsed back into the display name
// "Text" for sidebar highlighting. Keep this list in sync if a new tag is
// added to tags.json.
const CATEGORY_NAMES = [
  'Text',
  'Logical',
  'Number',
  'Date & Time',
  'Operators',
  'Global Variables',
  'Apex Class',
  'Randomization',
  'Type Processing',
  'Trigger',
  'Advanced',
] as const;

const slugifyCategory = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const SLUG_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  CATEGORY_NAMES.map((n) => [slugifyCategory(n), n])
);

export const categorySlug = (name: string): string => slugifyCategory(name);

export const categoryNameFromSlug = (slug: string): string | null =>
  SLUG_TO_CATEGORY[slug] ?? null;
