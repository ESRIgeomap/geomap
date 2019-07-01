/**
 * 二维地图初始化工作
 * @author  lee
 */

import AgsSearchUtil from '../../../utils/arcgis/search';
import * as mapUitls from '../../../utils/arcgis/map/mapviewUtil';
import * as actions from '../../../constants/action-types';
import { jsapi } from '../../../constants/geomap-utils';
import { AppProxy, Portal, WebmapID, SplitWebmap } from '../../../utils/env';
import widgets from '../../../utils/widgets';

import { synchronizeViews } from '../../../utils/arcgis/map/synchronizeView';

// debug obj
const ags = {};
window.agsGlobal = ags;
window.agstwoGlobal = {};

const agstwo = window.agstwoGlobal;

// 设置esriconfig
async function prepare() {
  const [esriConfig] = await jsapi.load(['esri/config']);
  // 设置跨域处理地址
  esriConfig.request.proxyUrl = AppProxy;
  // 设置portal地址
  esriConfig.portalUrl = Portal;
}

function initMapUtils(store) {
  AgsSearchUtil.instance().view = ags.view;
  AgsSearchUtil.instance().store = store;
}

function createMapView(opts = {}) {
  // Detect if 'createLogger' was passed directly to 'applyMiddleware'.
  if (opts.getState && opts.dispatch) {
    return () => next => action => next(action);
  }

  return store => next => async action => {
    switch (action.type) {
      // 初始化地图
      case actions.INIT_MAP: {
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

        // 初始化地图
        ags.view = await window.agsUtils.view.map2d.initMapView(Portal, WebmapID, ags.container);

        // after view created
        window.agsGlobal = ags;

        // TODO: to be continued
        initMapUtils(store);

        // When initialized...
        return ags.view.when(() => { });
      }
      case actions.INIT_SPLITMAP: {
        const { payload } = action;
        const { containers } = payload;
        // DOM container not defined
        if (!containers) break;

        // if sceneview container is already initialized, just add it back to the DOM.
        if (agstwo.containers) {
          containers.appendChild(agstwo.containers);
          break;
        }
        agstwo.containers = document.createElement('div');
        agstwo.containers.style.height = '100%';
        containers.appendChild(agstwo.containers);
        await prepare();
        // 初始化分屏对比地图
        agstwo.view = await window.agsUtils.view.map2d.initMapView(Portal, SplitWebmap, agstwo.containers);
        // 保持左右侧地图保持同步
        synchronizeViews([ags.view, agstwo.view]);
        return agstwo.view.when(() => {
          // Update the environment settings (either from the state or from the scene)
        });
      }
      case actions.SWITCH_MAP: {
        const { payload } = action;
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
export { createMapView };
