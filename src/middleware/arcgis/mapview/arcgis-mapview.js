// 组件
import MeasureUtil from '../../../utils/measure';
import Print2DMap from '../../../utils/Print2DMap';
import AgsSearchUtil from '../../../utils/arcgis/search';
import LegendList from '../../../utils/legend';
import * as mapUitls from '../../../utils/arcgis/map/LayerUtil';

import {
  INIT_MAP,
  INIT_SPLITMAP,
  SWITCH_MAP,
  VIEW_MODE_2D,
  VIEW_MODE_3D,
  MAP_ACTION_CLEAR_GRAPHICS,
  ACTION_MEASURE_2D_AREA,
  ACTION_MEASURE_2D_LINE,
  ACTION_PRINT_2D_MAP,
  MAP_ACTION_CLIP_MAP,
  ACTION_LEGENDLIST_SHOW,
  ACTION_LEGENDLIST_DEACTIVATE,
} from '../../../constants/action-types';
import { jsapi } from '../../../constants/geomap-utils';
import { AppProxy, Portal, WebsceneID, WebmapID, SplitWebmap } from '../../../utils/env';
import widgets from '../../../utils/widgets';
import { synchronizeViews } from '../../../utils/synchronizeView';

// debug obj
const ags = {};
window.agsGlobal = ags;
window.agstwoGlobal = {};

const agstwo = window.agstwoGlobal;

async function prepare() {
  const [esriConfig] = await jsapi.load(['esri/config']);
  esriConfig.request.proxyUrl = AppProxy;
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
      case INIT_MAP: {
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

        if (viewMode === VIEW_MODE_2D) {
          await initMapView(store);
          await widgets.createBasemapGallery(ags.view);
        } else if (viewMode === VIEW_MODE_3D) {
          ags.view = await  mapUitls.initSceneView(Portal,WebsceneID,ags.container);
          await widgets.createOverView(ags.view);
        }

        // after view created
        window.agsGlobal = ags;
        store.dispatch({ type: 'agsmap/afterViewCreated' });

        // TODO: to be continued
        initMapUtils(store);

        // When initialized...
        return ags.view.when(() => {
          // Update the environment settings (either from the state or from the scene)
          ags.view.map.layers.on('change',function(event){
             console.log(event);
          });
        });
      }

      case INIT_SPLITMAP: {
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
        await initsplitMapView();
        return agstwo.view.when(() => {
          // Update the environment settings (either from the state or from the scene)
        });
      }
      case SWITCH_MAP: {
        const { payload } = action;
        if (payload === VIEW_MODE_2D) {
          await initMapView();
        } else if (payload === VIEW_MODE_3D) {
          ags.view = await  mapUitls.initSceneView(Portal,WebsceneID,ags.container);
          await widgets.createOverView(ags.view);
          await widgets.createBasemapGallery(ags.view);
        }
        // await createToolButtons();
        break;
      }
      case MAP_ACTION_CLEAR_GRAPHICS: {
        MeasureUtil.mapView = ags.view;
        MeasureUtil.active('clearmeasure');
        break;
      }
      case ACTION_MEASURE_2D_LINE: {
        MeasureUtil.mapView = ags.view;
        MeasureUtil.active('line');
        break;
      }
      case ACTION_MEASURE_2D_AREA: {
        MeasureUtil.mapView = ags.view;
        MeasureUtil.active('area');
        break;
      }
      case ACTION_PRINT_2D_MAP: {
        Print2DMap.mapView = ags.view;
        Print2DMap.show();
        break;
      }
      case MAP_ACTION_CLIP_MAP: {
        Print2DMap.mapView = ags.view;
        Print2DMap.clipMap();
        break;
      }
      case ACTION_LEGENDLIST_SHOW: {
        LegendList.mapView = ags.view;
        LegendList.show();
        break;
      }
      case ACTION_LEGENDLIST_DEACTIVATE: {
        LegendList.mapView = ags.view;
        LegendList.deactivate();
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

async function initMapView(store) {
  const [WebMap, MapView] = await jsapi.load(['esri/WebMap', 'esri/views/MapView']);
  const webmap = new WebMap({
    portalItem: {
      id: WebmapID,
      portal: Portal,
    },
  });
  ags.view = new MapView({
    container: ags.container,
    map: webmap,
    ui: {
      components: [],
    },
  });
}

async function initsplitMapView() {
  const [WebMap, MapView, watchUtils] = await jsapi.load([
    'esri/WebMap',
    'esri/views/MapView',
    'esri/core/watchUtils',
  ]);
  const webmap = new WebMap({
    portalItem: {
      id: SplitWebmap,
      portal: Portal,
    },
  });
  agstwo.view = new MapView({
    container: agstwo.containers,
    map: webmap,
    ui: {
      components: [],
    },
  });
  synchronizeViews([ags.view, agstwo.view], watchUtils);
}


export { createMapView };
