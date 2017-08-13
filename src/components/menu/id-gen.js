let nextKey = new function () {
  let key =0;
  return function () { return 'key' + (key++) };
}
export default nextKey;
