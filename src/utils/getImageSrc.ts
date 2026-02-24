export function getImageSet(src: string) {
  return {
    thumb: src.replace("/assets/", "/assets/thumb/"),
    medium: src.replace("/assets/", "/assets/medium/"),
    full: src.replace("/assets/", "/assts/large/"),
  };
}
