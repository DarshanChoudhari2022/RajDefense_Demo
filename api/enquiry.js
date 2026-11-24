import { createHash } from "node:crypto";

const windowSeconds = 900;
const limit = 5;
const localBuckets = new Map();
const interests = new Set([
  "RAJAS RJS-H1",
  "Maritime systems",
  "Hydrogen technology",
  "Aircraft briefing",
  "Engineering visit",
  "Quality documentation",
  "Company information",
]);
const caps = {
  organisation: 120,
  name: 100,
  designation: 100,
  email: 200,
  phone: 40,
  interest: 40,
  message: 1800,
};

function respond(status, message, headers = {}) {
  return Response.json(
    { success: status === 200, message },
    {
      status,
      headers: { "Cache-Control": "no-store", ...headers },
    },
  );
}

async function checkRate(ip) {
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  const hash = createHash("sha256").update(ip).digest("hex");
  const key = "raj-enquiry:" + bucket + ":" + hash;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url || token) {
    if (!url || !token) throw new Error("Incomplete rate limit configuration");
    const response = await fetch(new URL("/pipeline", url), {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, windowSeconds * 2],
      ]),
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) throw new Error("Rate limit store unavailable");
    const result = await response.json();
    if (!Number.isInteger(result[0]?.result) || result[1]?.result !== 1)
      throw new Error("Invalid rate limit response");
    return result[0].result <= limit;
  }
  if (localBuckets.size >= 10000) localBuckets.clear();
  const current = localBuckets.get(hash);
  const count = current?.bucket === bucket ? current.count + 1 : 1;
  localBuckets.set(hash, { bucket, count });
  return count <= limit;
}

async function readSmallJson(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing body");
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 12000) {
      await reader.cancel();
      throw new Error("Request too large");
    }
    text += decoder.decode(value, { stream: true });
  }
  return JSON.parse(text + decoder.decode());
}

export async function POST(request) {
  const origin = request.headers.get("origin");
  if (
    request.headers.get("sec-fetch-site") === "cross-site" ||
    (origin && origin !== new URL(request.url).origin)
  ) {
    return respond(403, "Please submit the form from the Raj website.");
  }
  if (
    !/^application\/json(?:\s*;|$)/i.test(
      request.headers.get("content-type") || "",
    )
  ) {
    return respond(415, "The enquiry must be submitted as JSON.");
  }
  let input;
  try {
    input = await readSmallJson(request);
  } catch {
    return respond(400, "The enquiry could not be read.");
  }
  if (!input || typeof input !== "object" || Array.isArray(input))
    return respond(400, "Invalid enquiry.");
  if (input.website) return respond(400, "The enquiry could not be accepted.");

  const fields = {};
  for (const [name, max] of Object.entries(caps)) {
    const value = input[name] ?? "";
    if (typeof value !== "string" || value.length > max)
      return respond(400, "Please check the form fields.");
    fields[name] = value.trim();
  }
  if (
    !fields.organisation ||
    !fields.name ||
    !fields.message ||
    input.authorised !== true ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(fields.email) ||
    !interests.has(fields.interest)
  ) {
    return respond(
      400,
      "Complete the required fields with a valid email and enquiry topic.",
    );
  }
  const accessKey = (
    process.env.WEB3FORMS_ACCESS_KEY ||
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
    ""
  ).trim();
  if (!accessKey)
    return respond(
      503,
      "Online delivery is unavailable. Please email sales@rajprocess.com.",
    );

  try {
    const ip = process.env.VERCEL
      ? request.headers.get("x-forwarded-for")?.split(",")[0].trim()
      : null;
    if (!(await checkRate(ip || "unknown"))) {
      return respond(
        429,
        "Too many enquiries. Please wait a few minutes before trying again.",
        { "Retry-After": String(windowSeconds) },
      );
    }
    const result = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: "Raj Defence enquiry — " + fields.interest,
        ...fields,
        authorised: "Yes",
      }),
      redirect: "error",
      signal: AbortSignal.timeout(8500),
    });
    const receipt = await result.json();
    if (result.ok && receipt.success === true)
      return respond(200, "Enquiry accepted.");
  } catch {
    // The visitor can use email if the delivery provider or rate limit store is unavailable.
  }
  return respond(
    502,
    "We could not confirm delivery. Please try again or email sales@rajprocess.com.",
  );
}
