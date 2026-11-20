/** Client API côté serveur (Server Components). Côté navigateur : voir lib/use-cart-quote.ts. */
const BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiGet<T>(path: string, { revalidate = 60 }: { revalidate?: number } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}/api/v1${path}`, { headers: { Accept: "application/json" }, next: { revalidate } });
  } catch {
    throw new ApiError(0, `API injoignable (${BASE}). Le backend est-il démarré ?`);
  }
  if (!res.ok) throw new ApiError(res.status, `API ${res.status} sur ${path}`);
  return (await res.json()) as T;
}
