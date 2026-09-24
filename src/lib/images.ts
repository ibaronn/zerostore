const SEP = "|";

export function imageList(images: string | string[] | null | undefined): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter(Boolean);
  return images.split(SEP).filter(Boolean);
}

export function imageJoin(images: string[]): string {
  return images.filter(Boolean).join(SEP);
}

export function firstImage(images: string | string[] | null | undefined): string | null {
  return imageList(images)[0] ?? null;
}