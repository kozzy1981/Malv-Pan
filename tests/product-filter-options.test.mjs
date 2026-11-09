import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getProductFilterAvailability, resolveProductFilterChange } from "../src/lib/product-filter-options.ts";

const { products } = JSON.parse(readFileSync(new URL("../resources/products.json", import.meta.url), "utf8"));

test("category selection enables only related technologies, including missing-ID categories", () => {
  const availability = getProductFilterAvailability(products, { category: " Density analyzers ", technology: "" });
  assert.ok(availability.technologyTitles.size > 0);
  assert.ok(!availability.technologyTitles.has("laser diffraction"));
  for (const title of availability.technologyTitles) {
    assert.ok(products.some((product) =>
      product.categories.some((item) => item.title === "Density analyzers") &&
      product.technologies.some((item) => item.title.toLowerCase() === title)));
  }
  assert.equal(availability.categoryTitles, null);
});

test("technology selection enables matching categories in the reverse direction", () => {
  const availability = getProductFilterAvailability(products, { category: "", technology: " LASER DIFFRACTION " });
  assert.ok(availability.categoryTitles.has("particle size analyzers"));
  assert.ok(!availability.categoryTitles.has("microcalorimeters"));
  assert.equal(availability.technologyTitles, null);
});

test("changing category clears an incompatible technology but preserves the changed category", () => {
  assert.deepEqual(resolveProductFilterChange(products, {
    category: "Particle size analyzers", technology: "Laser Diffraction",
  }, "category", "Microcalorimeters"), { category: "Microcalorimeters", technology: "" });
});

test("changing technology clears an incompatible category but preserves the changed technology", () => {
  assert.deepEqual(resolveProductFilterChange(products, {
    category: "Microcalorimeters", technology: "",
  }, "technology", "Laser Diffraction"), { category: "", technology: "Laser Diffraction" });
});

test("compatible selections are retained in both directions", () => {
  const selection = { category: "Particle size analyzers", technology: "Laser Diffraction" };
  assert.deepEqual(resolveProductFilterChange(products, selection, "category", selection.category), selection);
  assert.deepEqual(resolveProductFilterChange(products, selection, "technology", selection.technology), selection);
});

test("All clears its restriction without clearing a compatible opposite selection", () => {
  const selection = { category: "Particle size analyzers", technology: "Laser Diffraction" };
  assert.deepEqual(resolveProductFilterChange(products, selection, "category", ""), {
    category: "", technology: "Laser Diffraction",
  });
  assert.deepEqual(resolveProductFilterChange(products, selection, "technology", ""), {
    category: "Particle size analyzers", technology: "",
  });
  assert.deepEqual(getProductFilterAvailability(products, { category: "", technology: "" }), {
    categoryTitles: null, technologyTitles: null,
  });
});

test("search/sort and current empty results do not constrain compatibility", () => {
  const selection = { category: "Particle size analyzers", technology: "Laser Diffraction" };
  assert.deepEqual(getProductFilterAvailability(products, {
    ...selection, search: "no-such-product", sort: "name-desc",
  }), getProductFilterAvailability(products, selection));
});

test("compatibility and invalidation never mutate source records or prior selection", () => {
  const original = structuredClone(products);
  const selection = Object.freeze({ category: "Microcalorimeters", technology: "" });
  resolveProductFilterChange(products, selection, "technology", "Laser Diffraction");
  assert.deepEqual(products, original);
  assert.deepEqual(selection, { category: "Microcalorimeters", technology: "" });
});
