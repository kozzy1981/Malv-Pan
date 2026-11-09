"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";
import type { ListingMode, ListingResponse } from "@/types/listing";
import { getProductFilterAvailability, resolveProductFilterChange } from "@/lib/product-filter-options";

const modeLabels: Record<ListingMode, string> = {
  products: "Products",
  categories: "Categories",
  technologies: "Technologies",
  measurementTypes: "Measurement Types",
};

interface ListingControls {
  mode: ListingMode;
  search: string;
  category: string;
  technology: string;
  sort: string;
}

const initialControls: ListingControls = {
  mode: "products", search: "", category: "", technology: "", sort: "",
};

interface ProductListingProps {
  products: readonly Product[];
  categoryOptions: readonly string[];
  technologyOptions: readonly string[];
}

/**
 * Hydrates server-rendered initial cards without a mount-time fetch. Select changes
 * request results immediately; search waits for submit. Superseded requests are
 * aborted so a slow response cannot overwrite newer selections.
 */
export function ProductListing({ products, categoryOptions, technologyOptions }: ProductListingProps) {
  const [controls, setControls] = useState<ListingControls>(initialControls);
  const [result, setResult] = useState<ListingResponse & { mode: ListingMode }>({
    products, total: products.length, mode: "products",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const activeRequest = useRef<AbortController | null>(null);
  // These props remain the complete initial collection, never the API-filtered result.
  const filterAvailability = getProductFilterAvailability(products, controls);

  function handleProductFilterChange(filter: "category" | "technology", value: string) {
    const nextSelection = resolveProductFilterChange(products, controls, filter, value);
    void loadResults({ ...controls, ...nextSelection });
  }

  useEffect(function cancelRequestOnUnmount() {
    return () => activeRequest.current?.abort();
  }, []);

  /** Retains existing results on failure instead of misrepresenting an error as no matches. */
  async function loadResults(nextControls: ListingControls) {
    setControls(nextControls);
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setIsLoading(true);
    setErrorMessage("");
    const parameters = new URLSearchParams({ mode: nextControls.mode });
    if (nextControls.search.trim()) parameters.set("search", nextControls.search.trim());
    if (nextControls.sort) parameters.set("sort", nextControls.sort);
    if (nextControls.mode === "products") {
      if (nextControls.category) parameters.set("category", nextControls.category);
      if (nextControls.technology) parameters.set("technology", nextControls.technology);
    }
    try {
      const response = await fetch(`/api/products?${parameters}`, { signal: controller.signal });
      const data: ListingResponse | { error: string } = await response.json();
      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "The listing request failed.");
      }
      if (!Array.isArray(data.products) || typeof data.total !== "number") {
        throw new Error("The listing response was not recognised.");
      }
      if (!controller.signal.aborted) setResult({ ...data, mode: nextControls.mode });
    } catch (error) {
      if (!controller.signal.aborted) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load the listing.");
      }
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadResults(controls);
  }

  function handleModeChange(mode: ListingMode) {
    // Product-only filters must not silently carry over into another collection.
    void loadResults({ ...controls, mode, category: "", technology: "" });
  }

  return (
    <section id="products" className="product-listing content-width" aria-labelledby="listing-heading">
      <form className="listing-controls" onSubmit={handleSearchSubmit}>
        <div className="listing-control-row">
          <label className="listing-field">
            Display
            <select value={controls.mode} onChange={(event) => handleModeChange(event.target.value as ListingMode)}>
              {Object.entries(modeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="listing-field">
            Sort
            <select value={controls.sort} aria-describedby="popularity-note" onChange={(event) => {
              void loadResults({ ...controls, sort: event.target.value });
            }}>
              <option value="">Original order</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="popular" disabled>Popularity (unavailable)</option>
            </select>
          </label>
          <button type="button" className="secondary-button" onClick={() => {
            void loadResults({ ...initialControls, mode: controls.mode });
          }}>Reset filters</button>
        </div>
        <p id="popularity-note" className="control-note">Popularity is unavailable: the source data does not define a popularity ranking.</p>
        <details className="listing-filters" open>
          <summary>Search and filters</summary>
          <div className="listing-filter-fields">
            <label className="listing-field">
              Search {modeLabels[controls.mode].toLowerCase()}
              <input type="search" value={controls.search} onChange={(event) => {
                setControls({ ...controls, search: event.target.value });
              }} />
            </label>
            <label className="listing-field">
              Category
              <select value={controls.category} disabled={controls.mode !== "products"} aria-describedby="product-filter-note" onChange={(event) => {
                handleProductFilterChange("category", event.target.value);
              }}>
                <option value="">All categories</option>
                {categoryOptions.map((title) => {
                  const unavailable = filterAvailability.categoryTitles !== null &&
                    !filterAvailability.categoryTitles.has(title.trim().toLowerCase());
                  return <option key={title} value={title} disabled={unavailable}>
                    {title}{unavailable ? " (unavailable with this technology)" : ""}
                  </option>;
                })}
              </select>
            </label>
            <label className="listing-field">
              Technology
              <select value={controls.technology} disabled={controls.mode !== "products"} aria-describedby="product-filter-note" onChange={(event) => {
                handleProductFilterChange("technology", event.target.value);
              }}>
                <option value="">All technologies</option>
                {technologyOptions.map((title) => {
                  const unavailable = filterAvailability.technologyTitles !== null &&
                    !filterAvailability.technologyTitles.has(title.trim().toLowerCase());
                  return <option key={title} value={title} disabled={unavailable}>
                    {title}{unavailable ? " (unavailable with this category)" : ""}
                  </option>;
                })}
              </select>
            </label>
            <button type="submit">Search</button>
          </div>
          <p id="product-filter-note" className="control-note">Category and technology filters apply to Products only. Unavailable combinations are disabled; an incompatible selection resets to All. Search text applies when you press Search, Enter or change a selection.</p>
        </details>
      </form>
      <div className="listing-heading">
        <h2 id="listing-heading">{modeLabels[result.mode]}</h2>
        <p role="status">{isLoading ? "Loading results…" : `${result.total} results`}</p>
      </div>
      {errorMessage && (
        <div className="listing-error">
          <p role="alert">Unable to update the listing: {errorMessage} Previous results remain below.</p>
          <button type="button" onClick={() => void loadResults(controls)}>Try again</button>
        </div>
      )}
      <div aria-busy={isLoading}>
        {result.products.length ? (
          <ul className="product-grid">
            {result.products.map((product) => (
              <li key={`${result.mode}-${product.id}`}><ProductCard product={product} /></li>
            ))}
          </ul>
        ) : (
          <p>No results match your selections. Try another search or reset filters.</p>
        )}
      </div>
    </section>
  );
}
