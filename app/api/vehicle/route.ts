import { NextResponse } from "next/server";

interface VehicleResult {
  Variable: string;
  Value: string | number | null;
}

function normalizeVin(vin: string) {
  return vin.trim().toUpperCase();
}

// vPIC returns an array under `Results`
function pickValue(results: VehicleResult[], key: string) {
  const row = results?.find((r) => r.Variable === key);
  const val = row?.Value;
  if (!val || val === "0" || val === "Not Applicable") return null;
  return String(val);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const vinRaw = searchParams.get("vin") ?? "";
  const modelYear = searchParams.get("modelYear"); // 👈 optional
  const vin = normalizeVin(vinRaw);

  if (!vin) {
    return NextResponse.json({ error: "VIN_REQUIRED" }, { status: 400 });
  }

  // VIN is usually 17 chars, but NHTSA also supports partial VINs (with *).
  if (vin.length < 8) {
    return NextResponse.json({ error: "VIN_TOO_SHORT" }, { status: 400 });
  }

  // 🔹 Build query params dynamically
  const query = new URLSearchParams({ format: "json" });
  if (modelYear) {
    query.set("modelyear", modelYear);
  }

  const endpoint = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(
    vin
  )}?${query.toString()}`;

  try {
    // Simple caching to reduce calls
    const r = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      cache: "force-cache",
      // optional: next: { revalidate: 60 * 60 * 24 } // 24h
    });

    if (!r.ok) {
      return NextResponse.json(
        { error: "NHTSA_FETCH_FAILED", status: r.status },
        { status: 502 }
      );
    }

    const data = await r.json();
    const results = data?.Results ?? [];

    // Map the fields you care about
    const make = pickValue(results, "Make");
    const model = pickValue(results, "Model");
    const yearStr = pickValue(results, "Model Year");
    const engine =
      pickValue(results, "Engine Model") ??
      pickValue(results, "Engine Configuration");

    const year = yearStr ? Number(yearStr) : null;

    return NextResponse.json({
      vin,
      make,
      model,
      year: Number.isFinite(year) ? year : null,
      engine,
      raw: data, // keep if you want, or remove
      source: "NHTSA",
    });
  } catch {
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
