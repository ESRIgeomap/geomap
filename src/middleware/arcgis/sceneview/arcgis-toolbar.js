
import {
  ACTION_MAP_PRINT_3D,
} from '../../../constants/action-types';
// 获取全局ags对象，用于其他组件获取其中的view对象

function toolbar(opts = {}) {
  if (opts.getState && opts.dispatch) {
    return () => next => action => next(action);
  }

  return () => next => action => {
    const ags = window.agsGlobal;
    switch (action.type) {
      // lih 20180725 工具条-环绕漫游
      
      default: {
        next(action);
        break;
      }
    }

    return Promise.resolve();
  };
}

export { toolbar };
