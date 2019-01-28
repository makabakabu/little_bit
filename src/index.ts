const typeOf = (anyType: any) =>
  Object.prototype.toString
    .call(anyType)
    .split(' ')[1]
    .replace(']', '')
    .toLowerCase();

export default typeOf;
