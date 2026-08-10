/**
 * Normalise a tag into a URL slug: trim, fold to lowercase and turn runs of
 * whitespace into a single hyphen ("Secure Boot" -> "secure-boot"). Written as
 * its own leaf module — no globs, no platform modules — so the post page can
 * import it without dragging getPosts' markdown globs into the client bundle.
 */
export const slugifyTag = (tag: string): string => tag.trim().toLowerCase().replace(/\s+/g, '-');
