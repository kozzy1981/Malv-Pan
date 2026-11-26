import { getProductDataset, getProducts } from "@/data/products";
import { queryListing, queryProducts } from "@/lib/query-products";

/** Handles GET /api/products; query logic is independent of HTTP and Next.js. */
export function GET(request: Request): Response {
  const parameters = new URL(request.url).searchParams;
  const query = {
    search: parameters.get("search"),
    category: parameters.get("category"),
    technology: parameters.get("technology"),
    sort: parameters.get("sort"),
  };
  const mode = parameters.get("mode");
  const result = mode === null || mode === "products"
    ? queryProducts(getProducts(), query)
    : queryListing(getProductDataset(), { ...query, mode });

  if ("error" in result) {
    return Response.json(result, { status: 400 });
  }

  return Response.json(result);
}
