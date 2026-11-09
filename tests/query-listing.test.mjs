import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { queryListing, queryProducts } from "../src/lib/query-products.ts";

const dataset = JSON.parse(readFileSync(new URL("../resources/products.json", import.meta.url), "utf8"));

test("listing API defaults remain identical to ST-03 products", () => {
  assert.deepEqual(queryListing(dataset), queryProducts(dataset.products));
});

test("all four display modes expose unchanged source records and counts", () => {
  for (const [mode, total] of [["products", 46], ["categories", 36], ["technologies", 19], ["measurementTypes", 50]]) {
    assert.deepEqual(queryListing(dataset, { mode }), { products: dataset[mode], total });
  }
});

test("technology matches trimmed case-insensitive exact nested titles", () => {
  const result = queryProducts(dataset.products, { technology: "  LASER DIFFRACTION  " });
  assert.ok(result.products.some((product) => product.title === "Mastersizer range"));
  assert.ok(result.products.every((product) => product.technologies.some(
    (technology) => technology.title === "Laser Diffraction",
  )));
  assert.deepEqual(queryProducts(dataset.products, { technology: "Laser" }), { products: [], total: 0 });
  assert.deepEqual(queryProducts(dataset.products, { technology: "unknown" }), { products: [], total: 0 });
  assert.deepEqual(queryProducts(dataset.products, { technology: "  " }).products, dataset.products);
});

test("technology, category, search and sorting combine with AND semantics", () => {
  const result = queryListing(dataset, {
    search: "Mastersizer", category: "Particle size analyzers", technology: "Laser Diffraction", sort: "name-desc",
  });
  assert.equal(result.total, 1);
  assert.equal(result.products[0].title, "Mastersizer range");
  assert.deepEqual(queryListing(dataset, {
    search: "Mastersizer", category: "Microcalorimeters", technology: "Laser Diffraction",
  }), { products: [], total: 0 });
});

test("taxonomy views search title/description safely despite nullable descriptions", () => {
  for (const mode of ["categories", "technologies", "measurementTypes"]) {
    assert.deepEqual(queryListing(dataset, { mode, search: "no-such-record" }), { products: [], total: 0 });
    const title = dataset[mode][0].title;
    const result = queryListing(dataset, { mode, search: ` ${title.toUpperCase()} ` });
    assert.ok(result.products.some((item) => item.title === title));
  }
  assert.ok(dataset.measurementTypes.some((item) => item.strapline === null));
});

test("taxonomy modes deliberately ignore product-only filters", () => {
  assert.deepEqual(queryListing(dataset, { mode: "categories", category: "unknown", technology: "unknown" }), {
    products: dataset.categories, total: 36,
  });
});

test("taxonomy name sorts are correct and do not reorder the source", () => {
  const subset = { ...dataset, categories: [dataset.categories[1], dataset.categories[0]] };
  assert.deepEqual(queryListing(subset, { mode: "categories", sort: "name-asc" }).products.map((item) => item.title), [
    "BET surface area analyzers", "Calibration Standards",
  ]);
  assert.deepEqual(queryListing(subset, { mode: "categories", sort: "name-desc" }).products.map((item) => item.title), [
    "Calibration Standards", "BET surface area analyzers",
  ]);
  assert.equal(subset.categories[0].title, "Calibration Standards");
});

test("invalid mode and unsupported popularity return explicit errors", () => {
  assert.match(queryListing(dataset, { mode: "invalid" }).error, /Invalid mode/);
  for (const mode of ["products", "categories", "technologies", "measurementTypes"]) {
    assert.match(queryListing(dataset, { mode, sort: "popular" }).error, /Invalid sort/);
  }
});

test("combined queries leave every source collection and record unchanged", () => {
  const original = structuredClone(dataset);
  for (const mode of ["products", "categories", "technologies", "measurementTypes"]) {
    queryListing(dataset, { mode, search: "analy", sort: "name-desc", technology: "Laser Diffraction" });
  }
  assert.deepEqual(dataset, original);
});
