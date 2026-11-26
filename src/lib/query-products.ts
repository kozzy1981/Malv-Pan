import type { Product, ProductDataset } from "@/types/product";
import type { ListingResponse } from "@/types/listing";

/** Raw query values; null represents a missing URL parameter. */
export interface ProductQuery {
  search?: string | null;
  category?: string | null;
  technology?: string | null;
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

/** Reuses the same accepted values and error contract for every display mode. */
function validateSort(sort: string | null | undefined): ProductQueryError | null {
  if (sort != null && sort !== "name-asc" && sort !== "name-desc") {
    return { error: 'Invalid sort. Use "name-asc" or "name-desc", or omit sort.' };
  }
  return null;
}

/**
 * Searches title/strapline text and matches nested category titles, then optionally
 * sorts a new array. Search, category and technology use AND semantics. Empty or unknown
 * taxonomy titles need no lookup: empty values disable filtering; unknown titles match
 * nothing. No source fields, records or ordering are changed.
 */
export function queryProducts(
  products: readonly Product[],
  query: ProductQuery = {},
): ProductQueryResponse | ProductQueryError {
  const { sort } = query;

  const sortError = validateSort(sort);
  if (sortError) return sortError;

  const search = query.search?.trim().toLowerCase() ?? "";
  const category = query.category?.trim().toLowerCase() ?? "";
  const technology = query.technology?.trim().toLowerCase() ?? "";

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

    const matchesTechnology =
      !technology ||
      product.technologies.some(function matchesTechnologyTitle(productTechnology) {
        return productTechnology.title.trim().toLowerCase() === technology;
      });

    return matchesSearch && matchesCategory && matchesTechnology;
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

/**
 * Selects a source collection for the listing API. Products reuse ST-03 logic;
 * taxonomy views support search/name sorting and ignore product-only filters.
 * Popularity is deliberately unsupported because its source meaning is unknown.
 */
export function queryListing(
  dataset: ProductDataset,
  query: ProductQuery & { mode?: string | null } = {},
): ListingResponse | ProductQueryError {
  const mode = query.mode ?? "products";
  if (mode === "products") return queryProducts(dataset.products, query);
  if (mode !== "categories" && mode !== "technologies" && mode !== "measurementTypes") {
    return { error: "Invalid mode. Use products, categories, technologies or measurementTypes." };
  }

  // Keep sort validation identical to the established product contract.
  const sortError = validateSort(query.sort);
  if (sortError) return sortError;

  const search = query.search?.trim().toLowerCase() ?? "";
  const matchingItems = dataset[mode].filter(function matchesSearch(item) {
    return !search || item.title.toLowerCase().includes(search) ||
      (item.strapline?.toLowerCase().includes(search) ?? false);
  });
  if (query.sort) {
    const direction = query.sort === "name-asc" ? 1 : -1;
    matchingItems.sort(function compareNames(firstItem, secondItem) {
      return direction * firstItem.title.localeCompare(secondItem.title, "en", { sensitivity: "base" });
    });
  }
  return { products: matchingItems, total: matchingItems.length };
}
