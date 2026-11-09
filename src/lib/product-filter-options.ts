import type { Product } from "@/types/product";

export interface ProductFilterSelection {
  category: string;
  technology: string;
}

/** null means no restriction, including root options with no linked products. */
interface ProductFilterAvailability {
  categoryTitles: ReadonlySet<string> | null;
  technologyTitles: ReadonlySet<string> | null;
}

function normaliseTitle(title: string): string {
  return title.trim().toLowerCase();
}

/**
 * Derives each dropdown's allowed titles from the opposite filter only.
 * Always use the complete original product collection: search/results must not
 * hide relationships. Titles, rather than sometimes-missing IDs, match the API.
 */
export function getProductFilterAvailability(
  products: readonly Product[],
  selection: ProductFilterSelection,
): ProductFilterAvailability {
  const category = normaliseTitle(selection.category);
  const technology = normaliseTitle(selection.technology);
  const categoryTitles = technology ? new Set<string>() : null;
  const technologyTitles = category ? new Set<string>() : null;

  for (const product of products) {
    if (technology && product.technologies.some((item) => normaliseTitle(item.title) === technology)) {
      for (const item of product.categories) categoryTitles?.add(normaliseTitle(item.title));
    }
    if (category && product.categories.some((item) => normaliseTitle(item.title) === category)) {
      for (const item of product.technologies) technologyTitles?.add(normaliseTitle(item.title));
    }
  }
  return { categoryTitles, technologyTitles };
}

/** Keeps the newly changed filter and clears its incompatible counterpart in one update. */
export function resolveProductFilterChange(
  products: readonly Product[],
  selection: ProductFilterSelection,
  changedFilter: "category" | "technology",
  value: string,
): ProductFilterSelection {
  const nextSelection = { ...selection, [changedFilter]: value };
  const availability = getProductFilterAvailability(products, nextSelection);
  if (changedFilter === "category" && nextSelection.technology &&
      availability.technologyTitles && !availability.technologyTitles.has(normaliseTitle(nextSelection.technology))) {
    nextSelection.technology = "";
  }
  if (changedFilter === "technology" && nextSelection.category &&
      availability.categoryTitles && !availability.categoryTitles.has(normaliseTitle(nextSelection.category))) {
    nextSelection.category = "";
  }
  return nextSelection;
}
