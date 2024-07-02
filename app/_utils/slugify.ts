function slugify(text: string) {
  if (!text) {
    return;
  }
  // Convert to lowercase and replace spaces with hyphens.
  text = text?.toLowerCase().replace(/\s+/g, "-");

  // Remove punctuation and other special characters.
  text = text?.replace(/[^a-z0-9-]+/g, "");

  // Remove trailing hyphens.
  text = text?.replace(/^-+|-+$/g, "");

  return text;
}

export default slugify;
