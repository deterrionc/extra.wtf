const sanitizeFilename = filename => {
  return filename.replace(/[\x00-\x1f\x80-\x9f:/\\*?"<>|]/g, '_').replace(/\s+/g, '');
}

module.exports = sanitizeFilename;