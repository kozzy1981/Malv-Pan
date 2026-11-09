import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { queryProducts } from "../src/lib/query-products.ts";

// Use the actual assessment records so tests exercise the real taxonomy structure.
const { products } = JSON.parse(
  readFileSync(new URL("../resources/products.json", import.meta.url), "utf8"),
);

function productTitles(result) {
  assert.ok(!("error" in result));
  assert.equal(result.total, result.products.length);
  return result.products.map((product) => product.title);
}

test("default query returns all 46 products and original order/values", () => {
  const result = queryProducts(products);
  assert.equal(result.total, 46);
  assert.deepEqual(result.products, products);
});

test("search trims whitespace and matches titles case-insensitively", () => {
  assert.deepEqual(productTitles(queryProducts(products, { search: "  zEtAsIzEr  " })), [
    "Zetasizer Advance Range", "Zetasizer Core",
  ]);
});

test("search also matches the available description (strapline)", () => {
  assert.deepEqual(productTitles(queryProducts(products, { search: "ENVELOPE DENSITY" })), [
    "GeoPyc",
  ]);
});

test("category uses trimmed case-insensitive exact nested titles", () => {
  assert.deepEqual(productTitles(queryProducts(products, { category: "  microCALORIMETERS  " })), [
    "MicroCal DSC range", "MicroCal ITC range",
  ]);
  assert.deepEqual(queryProducts(products, { category: "Microcal" }), { products: [], total: 0 });
});

test("categories without IDs work and repeated references do not duplicate products", () => {
  const result = queryProducts(products, { category: "Density analyzers" });
  assert.deepEqual(productTitles(result), ["AccuPyc", "GeoPyc"]);
  assert.ok(result.products.every((product) => product.categories.some(
    (category) => category.title === "Density analyzers" && category.id === "" && category.keywordTcmId === null,
  )));
});

test("category IDs are not accepted as title matches", () => {
  assert.deepEqual(queryProducts(products, { category: "67225" }), { products: [], total: 0 });
});

test("unknown categories return an empty success response", () => {
  assert.deepEqual(queryProducts(products, { category: "Unknown category" }), { products: [], total: 0 });
});

test("empty search/category values are absent", () => {
  assert.deepEqual(queryProducts(products, { search: "  ", category: "" }).products, products);
  assert.deepEqual(queryProducts(products, { search: null, category: null, sort: null }).products, products);
});

test("ascending and descending sorting use product titles", () => {
  // A deliberately unsorted subset with an unambiguous expected alphabetical order.
  const subset = [products[0], products[5], products[1]];
  assert.deepEqual(productTitles(queryProducts(subset, { sort: "name-asc" })), [
    "Aeris", "Mastersizer range", "Zetium",
  ]);
  assert.deepEqual(productTitles(queryProducts(subset, { sort: "name-desc" })), [
    "Zetium", "Mastersizer range", "Aeris",
  ]);
});

test("search, category and descending sorting combine with AND semantics", () => {
  assert.deepEqual(productTitles(queryProducts(products, {
    search: "  sIzEr  ", category: "  PARTICLE SIZE ANALYZERS  ", sort: "name-desc",
  })), ["Zetasizer Core", "Zetasizer Advance Range", "SAS II", "Mastersizer range"]);
  assert.deepEqual(queryProducts(products, { search: "Zetium", category: "Particle size analyzers" }), {
    products: [], total: 0,
  });
});

test("combined queries support categories without IDs", () => {
  assert.deepEqual(productTitles(queryProducts(products, {
    search: "pyc", category: "DENSITY ANALYZERS", sort: "name-desc",
  })), ["GeoPyc", "AccuPyc"]);
});

test("unmatched search returns an empty success response", () => {
  assert.deepEqual(queryProducts(products, { search: "no-such-product" }), { products: [], total: 0 });
});

test("invalid sort values produce a clear error even with no matching records", () => {
  for (const sort of ["popular", "NAME-ASC", "", " name-asc "]) {
    assert.deepEqual(queryProducts(products, { sort, search: "no-such-product" }), {
      error: 'Invalid sort. Use "name-asc" or "name-desc", or omit sort.',
    });
  }
});

test("sorting preserves source order and all nested source values", () => {
  const originalProducts = structuredClone(products);
  const frozenArray = Object.freeze([...products]);
  queryProducts(frozenArray, { sort: "name-asc" });
  queryProducts(frozenArray, { category: "Density analyzers", sort: "name-desc" });
  assert.deepEqual(products, originalProducts);
  assert.deepEqual(queryProducts(products).products, originalProducts);
});
