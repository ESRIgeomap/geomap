//pensiveant：数据选择依赖

export default {
  /**
   * 等分数组
   * @param {*} array 数组对象
   * @param {*} size 分组长度
   */
  sliceArrayBySize(array, size) {
    const result = [];
    for (var x = 0; x < Math.ceil(array.length / size); x++) {
      var start = x * size;
      var end = start + size;
      result.push(array.slice(start, end));
    }
    return result;
  },
  /**
   * 获取json对象的key数组。
   * @param {*} obj
   */
  getJsonobjKeys(obj) {
    return Object.keys(obj);
  },
  /**
   * 删除数组指定项
   * @param {*} arr
   * @param {*} item
   */
  deleteArrItem(arr, item) {
    if (arr.includes(item)) {
      arr.splice(arr.indexOf(item), 1);
    }
    return arr;
  },
  /**
   * 数组去重
   * @param {*} arr 要去重的数组
   */
  arrUnique(arr) {
    let newArr = new Set(arr);
    return [...newArr];
  },
/**
 * 颜色RGB对象转Hex
 * @param {*} colorRGB example {r:110,g:110,b:110}
 */
  colorRGB2Hex(colorRGB) {     
    var r = parseInt(colorRGB.r);
    var g = parseInt(colorRGB.g);
    var b = parseInt(colorRGB.b);
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
 }
};
