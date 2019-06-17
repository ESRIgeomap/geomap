/**
 * 二维地图初始化工作
 * @author  lee  
 */

import Print2DMap from '../../../utils/Print2DMap';
import AgsSearchUtil from '../../../utils/arcgis/search';
import * as mapUitls from '../../../utils/arcgis/map/mapviewUtil';
import * as actions from '../../../constants/action-types';
import { jsapi } from '../../../constants/geomap-utils';
import { AppProxy, Portal, WebsceneID, WebmapID, SplitWebmap } from '../../../utils/env';
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
// 初始化地图
async function initMap(viewMode) {
  if (viewMode === actions.VIEW_MODE_2D) {
    // 初始化二维地图
    ags.view = await mapUitls.initMapView(Portal, WebmapID, ags.container);
    // 创建底图切换微件
    await widgets.createBasemapGallery(ags.view);
  } else if (viewMode === actions.VIEW_MODE_3D) {
    // 初始化三维地图
    ags.view = await mapUitls.initSceneView(Portal, WebsceneID, ags.container);
    // 创建鹰眼微件
    await widgets.createOverView(ags.view);
  }
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
        const { container, viewMode } = payload;

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
        await initMap(viewMode);

        // after view created
        window.agsGlobal = ags;
        store.dispatch({ type: 'agsmap/afterViewCreated' });

        // TODO: to be continued
        initMapUtils(store);

        // When initialized...
        return ags.view.when(() => {
        });
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
        agstwo.view = await mapUitls.initMapView(Portal, SplitWebmap, agstwo.containers);
        // 保持左右侧地图保持同步
        synchronizeViews([ags.view, agstwo.view]);
        return agstwo.view.when(() => {
          // Update the environment settings (either from the state or from the scene)
        });
      }
      case actions.SWITCH_MAP: {
        const { payload } = action;
        await initMap(payload);
        break;
      }
      case actions.ACTION_PRINT_2D_MAP: {
        Print2DMap.mapView = ags.view;
        Print2DMap.show();
        break;
      }
      case actions.MAP_ACTION_CLIP_MAP: {
        Print2DMap.mapView = ags.view;
        Print2DMap.clipMap();
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
