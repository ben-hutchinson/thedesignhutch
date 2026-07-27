import { expect, test } from "@playwright/test";

import { createContactHandler } from "../../functions/api/contact";

const allowedOrigin = "https://thedesignhutch.com";
const formspreeEndpoint = "https://formspree.io/f/design-hutch";

type FetchCall = {
  input: RequestInfo | URL;
  init?: RequestInit;
};

type FetchResult = Response | Error;

function createFetchSequence(...results: FetchResult[]) {
  const calls: FetchCall[] = [];
  const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ input, init });
    const result = results.shift();

    if (!result) {
      throw new Error("Unexpected fetch call");
    }

    if (result instanceof Error) {
      throw result;
    }

    return result;
  };

  return { calls, fetcher };
}

function createContext({
  env = {},
  fields = {},
  headers = {},
  method = "POST",
  origin = allowedOrigin,
}: {
  env?: {
    ALLOWED_ORIGIN?: string;
    FORMSPREE_ENDPOINT?: string;
    TURNSTILE_SECRET_KEY?: string;
  };
  fields?: Record<string, string>;
  headers?: Record<string, string>;
  method?: string;
  origin?: string | null;
} = {}) {
  const requestHeaders = new Headers(headers);
  if (origin) {
    requestHeaders.set("Origin", origin);
  }

  let body: FormData | undefined;
  if (method === "POST") {
    body = new FormData();
    for (const [key, value] of Object.entries({
      name: "Alex Taylor",
      email: "alex@example.com",
      phone: "0161 555 0199",
      business: "Taylor Studio",
      currentWebsite: "https://example.com",
      enquiry: "We need a clearer website that generates more enquiries.",
      website: "",
      "cf-turnstile-response": "turnstile-token",
      ...fields,
    })) {
      body.set(key, value);
    }
  }

  return {
    env: {
      ALLOWED_ORIGIN: allowedOrigin,
      FORMSPREE_ENDPOINT: formspreeEndpoint,
      TURNSTILE_SECRET_KEY: "turnstile-secret",
      ...env,
    },
    request: new Request("https://thedesignhutch.com/api/contact", {
      method,
      headers: requestHeaders,
      body,
    }),
  };
}

async function expectJsonResponse(
  response: Response,
  status: number,
  body: { ok: boolean; message?: string },
) {
  expect(response.status).toBe(status);
  expect(response.headers.get("Cache-Control")).toBe("no-store");
  expect(response.headers.get("Content-Type")).toBe(
    "application/json; charset=utf-8",
  );
  expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
  await expect(response.json()).resolves.toEqual(body);
}

test("rejects a cross-origin request before calling external services", async () => {
  const { calls, fetcher } = createFetchSequence();
  const handler = createContactHandler({
    fetch: fetcher,
    randomUUID: () => "request-id",
  });

  const response = await handler(
    createContext({ origin: "https://attacker.example" }),
  );

  await expectJsonResponse(response, 403, {
    ok: false,
    message: "Please check your details and try again.",
  });
  expect(calls).toHaveLength(0);
});

test("returns 405 with the POST allowance for unsupported methods", async () => {
  const { fetcher } = createFetchSequence();
  const handler = createContactHandler({
    fetch: fetcher,
    randomUUID: () => "request-id",
  });

  const response = await handler(createContext({ method: "GET" }));

  expect(response.headers.get("Allow")).toBe("POST");
  await expectJsonResponse(response, 405, {
    ok: false,
    message: "Method not allowed.",
  });
});

for (const missing of ["FORMSPREE_ENDPOINT", "TURNSTILE_SECRET_KEY"] as const) {
  test(`returns 500 when ${missing} is missing`, async () => {
    const { fetcher } = createFetchSequence();
    const handler = createContactHandler({
      fetch: fetcher,
      randomUUID: () => "request-id",
    });

    const response = await handler(
      createContext({ env: { [missing]: undefined } }),
    );

    await expectJsonResponse(response, 500, {
      ok: false,
      message: "Unable to send right now. Please use email instead.",
    });
  });
}

test("rejects invalid contact fields before verification", async () => {
  const { calls, fetcher } = createFetchSequence();
  const handler = createContactHandler({
    fetch: fetcher,
    randomUUID: () => "request-id",
  });

  const response = await handler(
    createContext({ fields: { email: "not-an-email" } }),
  );

  await expectJsonResponse(response, 400, {
    ok: false,
    message: "Please check your details and try again.",
  });
  expect(calls).toHaveLength(0);
});

test("returns a quiet success for honeypot submissions", async () => {
  const { calls, fetcher } = createFetchSequence();
  const handler = createContactHandler({
    fetch: fetcher,
    randomUUID: () => "request-id",
  });

  const response = await handler(
    createContext({ fields: { website: "https://spam.example" } }),
  );

  await expectJsonResponse(response, 200, { ok: true });
  expect(calls).toHaveLength(0);
});

for (const [name, token] of [
  ["missing", ""],
  ["oversized", "x".repeat(2049)],
] as const) {
  test(`rejects a ${name} Turnstile token before verification`, async () => {
    const { calls, fetcher } = createFetchSequence();
    const handler = createContactHandler({
      fetch: fetcher,
      randomUUID: () => "request-id",
    });

    const response = await handler(
      createContext({ fields: { "cf-turnstile-response": token } }),
    );

    await expectJsonResponse(response, 400, {
      ok: false,
      message: "Please check your details and try again.",
    });
    expect(calls).toHaveLength(0);
  });
}

for (const [name, result] of [
  [
    "unsuccessful response",
    new Response(JSON.stringify({ success: false }), { status: 200 }),
  ],
  ["verification service failure", new Response(null, { status: 503 })],
  ["verification network failure", new Error("network unavailable")],
] as const) {
  test(`rejects a Turnstile ${name}`, async () => {
    const { calls, fetcher } = createFetchSequence(result);
    const handler = createContactHandler({
      fetch: fetcher,
      randomUUID: () => "request-id",
    });

    const response = await handler(createContext());

    await expectJsonResponse(response, 400, {
      ok: false,
      message: "Please check your details and try again.",
    });
    expect(calls).toHaveLength(1);
  });
}

for (const hostname of [undefined, "attacker.example"]) {
  test(`rejects Turnstile success with ${
    hostname ?? "no hostname"
  }`, async () => {
    const { calls, fetcher } = createFetchSequence(
      new Response(JSON.stringify({ success: true, hostname })),
    );
    const handler = createContactHandler({
      fetch: fetcher,
      randomUUID: () => "request-id",
    });

    const response = await handler(createContext());

    await expectJsonResponse(response, 400, {
      ok: false,
      message: "Please check your details and try again.",
    });
    expect(calls).toHaveLength(1);
  });
}

test("verifies Turnstile and delivers the validated submission to Formspree", async () => {
  const { calls, fetcher } = createFetchSequence(
    new Response(
      JSON.stringify({ success: true, hostname: "thedesignhutch.com" }),
    ),
    new Response(JSON.stringify({ ok: true }), { status: 200 }),
  );
  const handler = createContactHandler({
    fetch: fetcher,
    randomUUID: () => "request-id",
  });

  const response = await handler(
    createContext({
      headers: { "CF-Connecting-IP": "203.0.113.42" },
      origin: null,
    }),
  );

  await expectJsonResponse(response, 200, { ok: true });
  expect(calls).toHaveLength(2);

  const turnstileCall = calls[0];
  expect(String(turnstileCall?.input)).toBe(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  );
  expect(turnstileCall?.init?.method).toBe("POST");
  const turnstileBody = new URLSearchParams(String(turnstileCall?.init?.body));
  expect(Object.fromEntries(turnstileBody)).toEqual({
    secret: "turnstile-secret",
    response: "turnstile-token",
    idempotency_key: "request-id",
    remoteip: "203.0.113.42",
  });

  const formspreeCall = calls[1];
  expect(String(formspreeCall?.input)).toBe(formspreeEndpoint);
  expect(formspreeCall?.init?.method).toBe("POST");
  const formspreeHeaders = new Headers(formspreeCall?.init?.headers);
  expect(formspreeHeaders.get("Accept")).toBe("application/json");
  expect(formspreeHeaders.get("Content-Type")).toBe(
    "application/x-www-form-urlencoded",
  );
  const formspreeBody = new URLSearchParams(String(formspreeCall?.init?.body));
  expect(Object.fromEntries(formspreeBody)).toEqual({
    name: "Alex Taylor",
    email: "alex@example.com",
    phone: "0161 555 0199",
    business: "Taylor Studio",
    currentWebsite: "https://example.com",
    enquiry: "We need a clearer website that generates more enquiries.",
    _subject: "New enquiry for The Design Hutch from Alex Taylor",
  });
});

for (const [name, result] of [
  ["failure response", new Response(null, { status: 500 })],
  ["network failure", new Error("network unavailable")],
] as const) {
  test(`returns 502 for a Formspree ${name}`, async () => {
    const { calls, fetcher } = createFetchSequence(
      new Response(
        JSON.stringify({ success: true, hostname: "thedesignhutch.com" }),
      ),
      result,
    );
    const handler = createContactHandler({
      fetch: fetcher,
      randomUUID: () => "request-id",
    });

    const response = await handler(createContext());

    await expectJsonResponse(response, 502, {
      ok: false,
      message: "Unable to send right now. Please use email instead.",
    });
    expect(calls).toHaveLength(2);
  });
}
