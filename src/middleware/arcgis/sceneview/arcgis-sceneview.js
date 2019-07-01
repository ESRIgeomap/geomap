import { jsapi } from '../../../constants/geomap-utils';
import * as mapUitls from '../../../utils/arcgis/map/sceneviewUtil';
import * as actions from '../../../constants/action-types';
import widgets from '../../../utils/widgets';
import { AppProxy, Portal, WebsceneID } from '../../../utils/env';
const ags = {};
window.agsGlobal = ags;

// 设置esriconfig
async function prepare() {
  const [esriConfig] = await jsapi.load(['esri/config']);
  // 设置跨域处理地址
  esriConfig.request.proxyUrl = AppProxy;
  // 设置portal地址
  esriConfig.portalUrl = Portal;
}

function createSceneView(opts = {}) {
  // Detect if 'createLogger' was passed directly to 'applyMiddleware'.
  if (opts.getState && opts.dispatch) {
    return () => next => action => next(action);
  }

  return store => next => async action => {
    switch (action.type) {
      //初始化地图
      case actions.INIT_WEBSCENE: {
        const { payload } = action;
        const { container } = payload;

        // DOM container not defined
        if (!container) break;

        // if sceneview container is already initialized, just add it back to the DOM.
        if (ags.container) {
          container.appendChild(ags.container);
          break;
        }

        // Otherwise, create a new container element and a new scene view.
        ags.container = document.createElement('div');
        container.appendChild(ags.container);

        await prepare();

        ags.view = await mapUitls.initSceneView(Portal, WebsceneID, ags.container);
        // 创建鹰眼微件
        await widgets.createOverView(ags.view);

        // after view created
        window.agsGlobal = ags;

        // When initialized...
        return ags.view.when(() => { });
      }
      case actions.ACTION_MAP_OVERVIEW: {
        const visibleOverviewmap = action.payload;
        const overmap = document.getElementById('overmapDiv');
        if (visibleOverviewmap) {
          overmap.style.display = 'block';
        } else {
          overmap.style.display = 'none';
        }
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

export { createSceneView };
