import Image from "next/image";
import type { ListingItem } from "@/types/listing";

/** Presents source content without deriving badges or guessing missing product URLs. */
export function ProductCard({ product }: { product: ListingItem }) {
  const title = product.title?.trim() || "Product information";
  const headingId = `product-${product.id}`;
  // The dataset's metadata identifies this website as the base for relative URLs.
  const productUrl = product.url?.trim()
    ? new URL(product.url, "https://www.malvernpanalytical.com").href
    : null;
  const content = (
    <>
      <div className="product-image-area">
        {product.image?.trim() ? (
          <Image
            src={product.image}
            // The adjacent heading already identifies this product; repeating it adds no information.
            alt=""
            fill
            className="product-image"
            // Match the mobile image column, tablet/desktop grids and 78rem content cap.
            sizes="(width < 40rem) calc(34vw - 1.0625rem), (width < 64rem) calc(50vw - 3.25rem), (width < 80rem) calc(33.333vw - 3rem), (max-width: 81rem) calc(25vw - 3rem), 17.25rem"
            loading="lazy"
          />
        ) : (
          <span className="image-placeholder">Image unavailable</span>
        )}
      </div>
      <div className="product-copy">
        <h3 id={headingId}>{title}</h3>
        {product.strapline?.trim() && <p>{product.strapline}</p>}
      </div>
    </>
  );

  return (
    <article className="product-card">
      {productUrl ? (
        <a className="product-card-content" href={productUrl} aria-labelledby={headingId}>
          {content}
        </a>
      ) : (
        <div className="product-card-content">{content}</div>
      )}
    </article>
  );
}
