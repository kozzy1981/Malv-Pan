import Link from "next/link";

/** Introduces the listing with a single page heading and a native breadcrumb trail. */
export function ProductsHero() {
  return (
    <section className="products-hero" aria-labelledby="page-heading">
      <nav aria-label="Breadcrumb">
        <ol className="breadcrumbs">
          <li><Link href="/">Home</Link></li>
          <li aria-current="page">Products</li>
        </ol>
      </nav>
      <h1 id="page-heading">Products</h1>
      <p>Laboratory equipment and process solutions</p>
    </section>
  );
}
