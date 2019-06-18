import NavigationToggle from '../../../utils/NavigationToggle';
import SurroundRoam from '../../../utils/SurroundRoam';
import Print3DMap from '../../../utils/Print3DMap';
import {
  ACTION_MAP_OVERVIEW,
  ACTION_MAP_ROAM,
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
      // lih 20180718  工具条-地图鹰眼
      case ACTION_MAP_OVERVIEW: {
        NavigationToggle.active(ags.view, 'rotate');
        break;
      }
      // lih 20180725 工具条-环绕漫游
      case ACTION_MAP_ROAM: {
        if (ags.view) {
          SurroundRoam.sceneView = ags.view;
          SurroundRoam.active('roam');
          break;
        }
        break;
      }
      // liugh 20180928 工具条-地图截图
      case ACTION_MAP_PRINT_3D: {
        Print3DMap.sceneView = ags.view;
        Print3DMap.print();
        break;
      }
      default: {
        next(action);
        break;
      }
    }

    return Promise.resolve();
  };
}

export { toolbar };
