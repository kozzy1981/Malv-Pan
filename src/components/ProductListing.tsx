import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

/** Renders the initial source-ordered collection; interactive controls belong to ST-05. */
export function ProductListing({ products }: { products: readonly Product[] }) {
  return (
    <section id="products" className="product-listing content-width" aria-labelledby="listing-heading">
      <div className="listing-heading">
        <h2 id="listing-heading">All products</h2>
        <p>{products.length} products</p>
      </div>
      {products.length ? (
        <ul className="product-grid">
          {products.map((product) => (
            <li key={product.id}><ProductCard product={product} /></li>
          ))}
        </ul>
      ) : (
        <p>No products are available.</p>
      )}
    </section>
  );
}
