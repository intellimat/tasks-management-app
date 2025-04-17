type FetcherOptions<TBody = unknown> = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: TBody;
  headers?: HeadersInit;
};

export async function fetcher<TResponse = unknown, TBody = unknown>(
  url: string,
  options: FetcherOptions<TBody> = {}
): Promise<TResponse> {
  const { method = "GET", body, headers } = options;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Fetch error (${res.status}): ${errorText}`);
  }

  return res.json();
}
