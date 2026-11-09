import type { ProductTaxonomy } from "@/types/product";

/** Shared presentation fields; both products and root taxonomy records satisfy this shape. */
export type ListingItem = Pick<ProductTaxonomy, "id" | "title" | "strapline" | "image" | "url">;

export type ListingMode = "products" | "categories" | "technologies" | "measurementTypes";

export interface ListingResponse {
  // Retain the ST-03 response key for backwards compatibility, including alternate modes.
  products: readonly ListingItem[];
  total: number;
}
