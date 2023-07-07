const convertToSlug = (str) => {
  let slug = str.replace("-", " ");
  // Remove special characters, replace spaces with underscores
  slug = slug
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase();

  // Remove leading numbers followed by an underscore
  slug = slug.replace(/^\d+_/, "");

  // Replace hyphens with underscores
  slug = slug.replace(/-/g, "_");

  return slug;
};

module.exports = convertToSlug;
