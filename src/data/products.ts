import "server-only";

import suppliedProductDataset from "../../resources/products.json";
import type { Product, ProductDataset } from "@/types/product";

// TypeScript checks the imported JSON against the model without a type assertion.
// Importing the file also lets Next.js bundle it without runtime filesystem paths.
const productDataset: ProductDataset = suppliedProductDataset;

/**
 * Returns all supplied products in their original order for server-side consumers.
 *
 * No values are normalised or defaulted. The shared collection and nested records
 * are read-only in TypeScript so callers must create a new array before sorting.
 * The server-only marker prevents accidental imports into Client Components.
 */
export function getProducts(): readonly Product[] {
  return productDataset.products;
}

/** Exposes the original root collections to server consumers without copying source data. */
export function getProductDataset(): ProductDataset {
  return productDataset;
}
