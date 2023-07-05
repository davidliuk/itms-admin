export default function copy(source: any, dest: any) {
  Object.keys(dest).forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (source.hasOwnProperty(key)) {
      dest[key] = source[key];
    }
  });
}
