import { ProductListing } from "@/components/ProductListing";
import { ProductsHero } from "@/components/ProductsHero";
import { SiteHeader } from "@/components/SiteHeader";
import { getProductDataset, getProducts } from "@/data/products";

/** Server Components can read the shared accessor directly without an internal HTTP call. */
export default function HomePage() {
  const products = getProducts();
  const dataset = getProductDataset();
  // Include nested titles because some source categories have no root entry or ID.
  const categoryOptions = [...new Set([
    ...dataset.categories.map((category) => category.title),
    ...products.flatMap((product) => product.categories.map((category) => category.title)),
  ])].sort((firstTitle, secondTitle) => firstTitle.localeCompare(secondTitle, "en"));
  const technologyOptions = [...new Set([
    ...dataset.technologies.map((technology) => technology.title),
    ...products.flatMap((product) => product.technologies.map((technology) => technology.title)),
  ])].sort((firstTitle, secondTitle) => firstTitle.localeCompare(secondTitle, "en"));
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <ProductsHero />
        <ProductListing products={products} categoryOptions={categoryOptions} technologyOptions={technologyOptions} />
      </main>
    </>
  );
}
