// Helpers for the API's decimal-as-string wire format.
// The Go backend serializes `decimal.Decimal` fields as JSON strings
// (e.g. "0.25", "-74.0058") to preserve precision. The FE consumes them
// as strings and converts at the use site rather than transforming at
// the API boundary (keeps types honest, avoids precision footguns).

export type DecimalLike = string | number | null | undefined;

/** Coerce a decimal-string / number / null to a JS number; non-finite -> fallback. */
export function toNum(v: DecimalLike, fallback = 0): number {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

/** True only if v parses to a finite number. Useful for "missing geo" checks. */
export function isFiniteDecimal(v: DecimalLike): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === 'number') return Number.isFinite(v);
  const n = parseFloat(v);
  return Number.isFinite(n);
}

/** Currency-formatted string. Falls back to "$0.00" style on null/invalid input. */
export function formatCost(v: DecimalLike, currency: string = 'USD'): string {
  if (!isFiniteDecimal(v)) return '—';
  const n = toNum(v);
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

/** Coordinate formatted to 5 decimals; "—" if missing/invalid. */
export function formatLatLng(lat: DecimalLike, lon: DecimalLike): string {
  if (!isFiniteDecimal(lat) || !isFiniteDecimal(lon)) return '—';
  return `${toNum(lat).toFixed(5)}, ${toNum(lon).toFixed(5)}`;
}
