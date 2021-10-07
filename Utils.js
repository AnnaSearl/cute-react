export default function flatArray(arr) {
  if (!Array.isArray(arr)) {
    return [];
  }
  return arr.reduce(function (prev, cur) {
    return prev.concat(Array.isArray(cur) ? flatArray(cur) : cur);
  }, []);
}
