// 组件
import MeasureUtil from '../../../utils/measure';
import Print2DMap from '../../../utils/Print2DMap';
import Sketch from '../../../utils/arcgis/sketchUtil';
import AgsSearchUtil from '../../../utils/arcgis/search';

import {
  INIT_MAP,
  INIT_SPLITMAP,
  SWITCH_MAP,
  VIEW_MODE_2D,
  VIEW_MODE_3D,
  MAP_ACTION_CLEAR_GRAPHICS,
  ACTION_MEASURE_2D_AREA,
  ACTION_MEASURE_2D_LINE,
  ACTION_DRAW_POINT_2D,
  ACTION_DRAW_LINE_2D,
  ACTION_DRAW_FLAT_2D,
  ACTION_VIEW_EXTENT,
  ACTION_PRINT_2D_MAP,
} from '../../../constants/action-types';
import { jsapi } from '../../../constants/geomap-utils';
import env from '../../../utils/env';
import widgets from '../../../utils/widgets';
import { synchronizeViews } from '../../../utils/synchronizeView';

const ags = {};
const agstwo = {};
env.setParamAgs(ags);
env.setParamAgstwo(agstwo);

async function prepare() {
  const [esriConfig] = await jsapi.load(['esri/config']);
  esriConfig.request.proxyUrl = env.getProxyUrl();
  esriConfig.portalUrl = env.getPortal();
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
          widgets.getPoints(ags.view);
        } else if (viewMode === VIEW_MODE_3D) {
          await initSceneView();
          await widgets.createOverView(ags.view);
        }
        // create buttons
        await createToolButtons();

        initMapUtils(store);

        // When initialized...
        return ags.view.when(() => {
          // Update the environment settings (either from the state or from the scene)
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
        // const basemap = env.getDefaultBasemap3D();
        const { payload } = action;
        if (payload === VIEW_MODE_2D) {
          await initMapView();
          widgets.getPoints(ags.view);
        } else if (payload === VIEW_MODE_3D) {
          const showl = document.getElementById('showl');
          showl.innerHTML = '';
          await initSceneView();
          await widgets.createOverView(ags.view);
        }
        await createToolButtons();
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
      case ACTION_DRAW_POINT_2D: {
        const sketchUtil = new Sketch(ags.view);
        sketchUtil.Drawpoint();
        break;
      }
      case ACTION_DRAW_LINE_2D: {
        const sketchUtil = new Sketch(ags.view);
        sketchUtil.Drawline();
        break;
      }
      case ACTION_DRAW_FLAT_2D: {
        const sketchUtil = new Sketch(ags.view);
        sketchUtil.DrawPolygon();
        break;
      }

      case ACTION_VIEW_EXTENT: {
        const { payload } = action;
        const extent = payload.country ? payload.country.extent : payload.city.extent;
        const coords = extent.split('_');
        const [Extent, GeometryService, ProjectParameters] = await jsapi.load([
          'esri/geometry/Extent',
          'esri/tasks/GeometryService',
          'esri/tasks/support/ProjectParameters',
        ]);
        const ext = new Extent({
          xmin: coords[0],
          ymin: coords[1],
          xmax: coords[2],
          ymax: coords[3],
          spatialReference: { wkid: 102100 },
        });

        const geomServ = new GeometryService({
          url: window.appcfg.geometryService,
        });
        const params = new ProjectParameters({
          geometries: [ext],
          outSpatialReference: ags.view.spatialReference,
        });
        geomServ.project(params).then(result => {
          const geometry = new Extent({
            xmin: result[0].xmin,
            ymin: result[0].ymin,
            xmax: result[0].xmax,
            ymax: result[0].ymax,
            spatialReference: ags.view.spatialReference,
          });
          ags.view.goTo(geometry);
        });
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
      id: env.getWebMapId(),
      portal: env.getPortal(),
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
      id: env.getSplitWebMapId(),
      portal: env.getPortal(),
    },
  });
  agstwo.view = new MapView({
    container: agstwo.containers,
    map: webmap,
    ui: {
      components: [],
    },
  });
  widgets.createBasemapGallery(agstwo.view);
  synchronizeViews([ags.view, agstwo.view], watchUtils);
}

async function initSceneView() {
  const [WebScene, Sceneview] = await jsapi.load(['esri/WebScene', 'esri/views/SceneView']);
  const scene = new WebScene({
    portalItem: {
      id: env.getWebSceneId(),
      portal: env.getPortal(),
    },
  });
  ags.view = new Sceneview({
    container: ags.container,
    map: scene,
    environment: {
      atmosphere: {
        // creates a realistic view of the atmosphere
        quality: 'high',
      },
      // wangfh 修改光照
      lighting: {
        date: new Date(),
        directShadowsEnabled: false,
        // don't update the view time when user pans.
        // The clock widget drives the time
        cameraTrackingEnabled: false,
      },
    },
    ui: {
      components: [],
    },
  });
}

function createToolButtons() {
  widgets.createZoom(ags.view);
  widgets.createCompass(ags.view);
  widgets.createBasemapGallery(ags.view);
}

export { createMapView };
