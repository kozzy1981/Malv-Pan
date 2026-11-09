import type { Product } from "@/types/product";

/** Raw query values; null represents a missing URL parameter. */
export interface ProductQuery {
  search?: string | null;
  category?: string | null;
  sort?: string | null;
}

/** Successful results retain the original product records without projecting fields. */
export interface ProductQueryResponse {
  products: readonly Product[];
  total: number;
}

/** A deliberate query validation failure, returned by the route as HTTP 400. */
export interface ProductQueryError {
  error: string;
}

/**
 * Searches title/strapline text and matches nested category titles, then optionally
 * sorts a new array. Search and category use AND semantics. Empty or unknown
 * categories need no lookup: empty values disable filtering; unknown titles match
 * nothing. No source fields, records or ordering are changed.
 */
export function queryProducts(
  products: readonly Product[],
  query: ProductQuery = {},
): ProductQueryResponse | ProductQueryError {
  const { sort } = query;

  if (sort != null && sort !== "name-asc" && sort !== "name-desc") {
    return { error: 'Invalid sort. Use "name-asc" or "name-desc", or omit sort.' };
  }

  const search = query.search?.trim().toLowerCase() ?? "";
  const category = query.category?.trim().toLowerCase() ?? "";

  // filter creates a new array even without criteria, keeping later sorting safe.
  const matchingProducts = products.filter(function matchesQuery(product) {
    const matchesSearch =
      !search ||
      product.title.toLowerCase().includes(search) ||
      product.strapline.toLowerCase().includes(search);
    const matchesCategory =
      !category ||
      product.categories.some(function matchesCategoryTitle(productCategory) {
        return productCategory.title.trim().toLowerCase() === category;
      });

    return matchesSearch && matchesCategory;
  });

  if (sort) {
    const direction = sort === "name-asc" ? 1 : -1;
    matchingProducts.sort(function compareProductNames(firstProduct, secondProduct) {
      // Fixed English collation makes results independent of the server's locale.
      // Stable sorting retains source order when titles compare equally.
      return direction * firstProduct.title.localeCompare(secondProduct.title, "en", {
        sensitivity: "base",
      });
    });
  }

  return { products: matchingProducts, total: matchingProducts.length };
}
