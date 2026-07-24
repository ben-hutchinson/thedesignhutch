import { contactSchema } from "../../lib/validation";

type Env = {
  ALLOWED_ORIGIN?: string;
  FORMSPREE_ENDPOINT?: string;
  TURNSTILE_SECRET_KEY?: string;
};

type PagesFunctionContext = {
  request: Request;
  env: Env;
};

type TurnstileResponse = {
  success?: boolean;
  hostname?: string;
  "error-codes"?: string[];
};

const allowedOriginDefault = "https://thedesignhutch.com";
const validationMessage = "Please check your details and try again.";
const deliveryMessage = "Unable to send right now. Please use email instead.";

function jsonResponse(
  body: { ok: boolean; message?: string },
  init: ResponseInit = {},
) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      ...init.headers,
    },
  });
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getAllowedHost(allowedOrigin: string) {
  try {
    return new URL(allowedOrigin).hostname;
  } catch {
    return new URL(allowedOriginDefault).hostname;
  }
}

async function validateTurnstile({
  allowedOrigin,
  request,
  secret,
  token,
}: {
  allowedOrigin: string;
  request: Request;
  secret: string;
  token: string;
}) {
  const siteverifyBody = new URLSearchParams({
    secret,
    response: token,
    idempotency_key: crypto.randomUUID(),
  });
  const remoteIp = request.headers.get("CF-Connecting-IP");

  if (remoteIp) {
    siteverifyBody.set("remoteip", remoteIp);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: siteverifyBody,
    },
  );

  if (!response.ok) {
    return false;
  }

  const result = (await response
    .json()
    .catch(() => null)) as TurnstileResponse | null;

  if (!result?.success) {
    return false;
  }

  if (result.hostname && result.hostname !== getAllowedHost(allowedOrigin)) {
    return false;
  }

  return true;
}

export async function onRequest(context: PagesFunctionContext) {
  const { env, request } = context;
  const allowedOrigin = env.ALLOWED_ORIGIN ?? allowedOriginDefault;
  const origin = request.headers.get("Origin");

  if (origin && origin !== allowedOrigin) {
    return jsonResponse(
      { ok: false, message: validationMessage },
      { status: 403 },
    );
  }

  if (request.method !== "POST") {
    return jsonResponse(
      { ok: false, message: "Method not allowed." },
      {
        status: 405,
        headers: {
          Allow: "POST",
        },
      },
    );
  }

  if (!env.FORMSPREE_ENDPOINT || !env.TURNSTILE_SECRET_KEY) {
    return jsonResponse(
      { ok: false, message: deliveryMessage },
      { status: 500 },
    );
  }

  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return jsonResponse(
      { ok: false, message: validationMessage },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse({
    name: getString(formData, "name"),
    email: getString(formData, "email"),
    phone: getString(formData, "phone"),
    business: getString(formData, "business"),
    currentWebsite: getString(formData, "currentWebsite"),
    enquiry: getString(formData, "enquiry"),
    website: getString(formData, "website"),
  });

  if (!parsed.success) {
    return jsonResponse(
      { ok: false, message: validationMessage },
      { status: 400 },
    );
  }

  if (parsed.data.website.trim() !== "") {
    return jsonResponse({ ok: true });
  }

  const turnstileToken = getString(formData, "cf-turnstile-response");

  if (!turnstileToken || turnstileToken.length > 2048) {
    return jsonResponse(
      { ok: false, message: validationMessage },
      { status: 400 },
    );
  }

  const turnstileOk = await validateTurnstile({
    allowedOrigin,
    request,
    secret: env.TURNSTILE_SECRET_KEY,
    token: turnstileToken,
  }).catch(() => false);

  if (!turnstileOk) {
    return jsonResponse(
      { ok: false, message: validationMessage },
      { status: 400 },
    );
  }

  const body = new URLSearchParams({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    business: parsed.data.business,
    currentWebsite: parsed.data.currentWebsite,
    enquiry: parsed.data.enquiry,
    _subject: `New enquiry for The Design Hutch from ${parsed.data.name}`,
  });

  const formspreeResponse = await fetch(env.FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  }).catch(() => null);

  if (!formspreeResponse?.ok) {
    return jsonResponse(
      { ok: false, message: deliveryMessage },
      { status: 502 },
    );
  }

  return jsonResponse({ ok: true });
}
