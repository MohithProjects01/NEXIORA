const TAG_REGEX = /<[^>]*>?/gm;

export function sanitizeText(value: string) {
  return value.replace(TAG_REGEX, "").replace(/\s+/g, " ").trim();
}

export function sanitizeStringArray(values: string[] | undefined) {
  return values?.map((value) => sanitizeText(value)).filter(Boolean) ?? [];
}
