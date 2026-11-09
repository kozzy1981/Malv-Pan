import { ProductListing } from "@/components/ProductListing";
import { ProductsHero } from "@/components/ProductsHero";
import { SiteHeader } from "@/components/SiteHeader";
import { getProducts } from "@/data/products";

/** Server Components can read the shared accessor directly without an internal HTTP call. */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <ProductsHero />
        <ProductListing products={getProducts()} />
      </main>
    </>
  );
}
