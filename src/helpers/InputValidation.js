export function isValidImageExtension(image) {
  return image && image.search(/(\.png|\.jpg|\.jpeg)$/ig) !== -1;
}
