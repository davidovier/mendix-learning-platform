// lib/utm.ts

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const UTM_STORAGE_KEY = "mendix_prep_utm";

export type UTMParams = Partial<Record<(typeof UTM_PARAMS)[number], string>>;

export function captureUTM(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};

  for (const key of UTM_PARAMS) {
    const value = params.get(key);
    if (value) {
      utm[key] = value;
    }
  }

  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  }
}

export function getUTM(): UTMParams | null {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as UTMParams;
  } catch {
    return null;
  }
}

export function clearUTM(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(UTM_STORAGE_KEY);
}
