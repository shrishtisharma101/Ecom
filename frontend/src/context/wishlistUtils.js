export const isSameProduct = (left, right) =>
  String(left.id) === String(right.id) && left.title === right.title;
