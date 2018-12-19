// ---------------------------------------------------
// 表面注记
// ---------------------------------------------------

let inst = null;

export const ID_REMARK_LAYER = 'id-layer-remark';

export default class RemarkTool {
  constructor() {
    this.hoverHandle = null;
    this.view = null;
    this.store = null;
  }

  static instance() {
    if (!inst) {
      inst = new RemarkTool();
    }

    return inst;
  }
}
