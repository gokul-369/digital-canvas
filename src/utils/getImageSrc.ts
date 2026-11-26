// image15.webp (Mailboxes) and image31.webp (White town) do not have medium variants in the repository.
// Falling back to full ensures they render seamlessly without 404 black screens.
const MISSING_MEDIUM = new Set(["image15.webp", "image31.webp"]);

export function getImageSet(src: string) {
  const filename = src.split("/").pop() || "";
  const hasMedium = !MISSING_MEDIUM.has(filename);

  return {
    thumb: src.replace("/assets/full/", "/assets/thumb/"),
    medium: hasMedium ? src.replace("/assets/full/", "/assets/medium/") : src,
    full: src,
  };
}

