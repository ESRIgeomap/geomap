import Measure3DUtil from '../../../utils/measure3D';
import NavigationToggle from '../../../utils/NavigationToggle';
import Eyeview from '../../../utils/Eyeview';
import SurroundRoam from '../../../utils/SurroundRoam';
import Print3DMap from '../../../utils/Print3DMap';
import {
  ACTION_MEASURE_LINE_3D,
  ACTION_MEASURE_AREA_3D,
  ACTION_MAP_PAN,
  ACTION_MAP_ROTATE,
  ACTION_MAP_OVERVIEW,
  ACTION_MAP_EYEVIEW,
  ACTION_MAP_ROAM,
  ACTION_MAP_PRINT_3D,
} from '../../../constants/action-types';
import env from '../../../utils/env';
// 获取全局ags对象，用于其他组件获取其中的view对象
const ags = env.getParamAgs();

function toolbar(opts = {}) {
  if (opts.getState && opts.dispatch) {
    return () => next => action => next(action);
  }

  return () => next => action => {
    switch (action.type) {
      // lih 20180718  工具条-三维长度测量
      case ACTION_MEASURE_LINE_3D: {
        Measure3DUtil.sceneView = ags.view;
        Measure3DUtil.active('line');
        break;
      }
      // lih 20180718  工具条-三维面积测量
      case ACTION_MEASURE_AREA_3D: {
        Measure3DUtil.sceneView = ags.view;
        Measure3DUtil.active('area');
        break;
      }
      // lih 20180718  工具条-地图平移
      case ACTION_MAP_PAN: {
        NavigationToggle.active(ags.view, 'pan');
        break;
      }
      // lih 20180718  工具条-地图旋转
      case ACTION_MAP_ROTATE: {
        NavigationToggle.active(ags.view, 'rotate');
        break;
      }
      // lih 20180718  工具条-地图鹰眼
      case ACTION_MAP_OVERVIEW: {
        NavigationToggle.active(ags.view, 'rotate');
        break;
      }
      case ACTION_MAP_EYEVIEW: {
        // Eyeview.sceneView = ags.view;
        Eyeview.active(ags.view,'eyeview');
        break;
      }
      // lih 20180725 工具条-环绕漫游
      case ACTION_MAP_ROAM: {
        SurroundRoam.sceneView = ags.view;
        SurroundRoam.active('roam');
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
