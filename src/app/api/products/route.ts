import { getProducts } from "@/data/products";
import { queryProducts } from "@/lib/query-products";

/** Handles GET /api/products; query logic is independent of HTTP and Next.js. */
export function GET(request: Request): Response {
  const parameters = new URL(request.url).searchParams;
  const result = queryProducts(getProducts(), {
    search: parameters.get("search"),
    category: parameters.get("category"),
    sort: parameters.get("sort"),
  });

  if ("error" in result) {
    return Response.json(result, { status: 400 });
  }

  return Response.json(result);
}
