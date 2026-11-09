import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// Run against a separately started production server, keeping normal unit tests fast.
const origin = process.env.PRODUCT_API_URL || "http://localhost:3002";
const dataset = JSON.parse(readFileSync(new URL("../../resources/products.json", import.meta.url), "utf8"));

async function requestProducts(parameters = {}, expectedStatus = 200) {
  const url = new URL("/api/products", origin);
  url.search = new URLSearchParams(parameters).toString();
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  assert.equal(response.status, expectedStatus, url.toString());
  assert.match(response.headers.get("content-type"), /application\/json/);
  return response.json();
}

test("HTTP default and alternate modes return the complete original collections", async () => {
  assert.deepEqual(await requestProducts(), { products: dataset.products, total: 46 });
  for (const mode of ["categories", "technologies", "measurementTypes"]) {
    assert.deepEqual(await requestProducts({ mode }), {
      products: dataset[mode], total: dataset[mode].length,
    });
  }
});

test("HTTP combined query parameters reach server-side filtering and sorting", async () => {
  const result = await requestProducts({
    search: "  MASTERSIZER ", category: "particle SIZE analyzers",
    technology: "LASER DIFFRACTION", sort: "name-desc",
  });
  assert.equal(result.total, 1);
  assert.deepEqual(result.products, dataset.products.filter((product) => product.title === "Mastersizer range"));
});

test("HTTP invalid modes/sorts return 400 and the JSON error contract", async () => {
  for (const parameters of [{ mode: "unknown" }, { mode: "" }, { sort: "" }, { sort: "name-sideways" }, { mode: "technologies", sort: "popular" }]) {
    const error = await requestProducts(parameters, 400);
    assert.deepEqual(Object.keys(error), ["error"]);
    assert.match(error.error, /Invalid (mode|sort)/);
  }
});

test("HTTP empty results are successful and do not alter subsequent source results", async () => {
  assert.deepEqual(await requestProducts({ category: "Density analyzers", technology: "Laser Diffraction" }), {
    products: [], total: 0,
  });
  assert.deepEqual(await requestProducts(), { products: dataset.products, total: 46 });
});
