import React from 'react';
import ReactDOM from 'react-dom';

// 组件
// import Expand from '../../../components/widgets/Expand';
// import LayerList from 'esri/widgets/LayerList';
// import Home from '../../../components/widgets/Home';
import MeasureUtil from '../../../utils/measure';
import Print2DMap from '../../../utils/Print2DMap';
import Sketch from '../../../utils/arcgis/sketchUtil';
import SurfaceLabel from '../../../utils/arcgis/surface-label';
// import DrawSimple from '../../../utils/drawpoint';
import MapCorrect from '../../../utils/mapcorrection';
import AgsSearchUtil from '../../../utils/arcgis/search';
import Zoom from '../../../components/widgets/Zoom';
import Getpoints from '../../../components/widgets/Getpoints';
import Compass from '../../../components/widgets/Compass';
import Overviewmap from '../../../components/overviewmap/Overviewmap';

import {
  INIT_MAP,
  INIT_SPLITMAP,
  SWITCH_MAP,
  VIEW_MODE_2D,
  VIEW_MODE_3D,
  ACTION_MAP_OVERVIEW,
  MAP_ACTION_CLEAR_GRAPHICS,
  ACTION_MEASURE_2D_AREA,
  ACTION_MEASURE_2D_LINE,
  ACTION_DRAW_POINT_2D,
  ACTION_DRAW_LINE_2D,
  ACTION_DRAW_FLAT_2D,
  ACTION_ADDBOOKMARK_2D,
  ACTION_GOTOBOOKMARK_2D,
  ACTION_DELETBOOKMARK_2D,
  ACTION_DELETTHISBOOKMARK_2D,
  ACTION_EDITBOOKMARK_2D,
  ACTION_MAP_2D_CORRECT,
  ACTION_ADDMAPCORRECT_2D,
  ACTION_VIEW_EXTENT,
  ACTION_PRINT_2D_MAP,
} from '../../../constants/action-types';
import {
  PIN_START,
  PIN_END,
  MAP_ACTION_DRAWLINE,
  MAP_ACTION_DRAW_DRIVELINE,
  MAP_ACTION_HIGHLIGHT_DRIVE,
  MAP_ACTION_CLEAR,
  MAP_ACTION_HIGHLIGHT,
  MAP_ACTION_DRAW_POI,
  MAP_ACTION_HIGHLIGHT_POI,
  MAP_ACTION_CLEAR_HIGHLIGHT_POI,
  MAP_ACTION_DRAW_NEARBY,
  MAP_ACTION_HIGHLIGHT_NEARBY,
  MAP_ACTION_CLEAR_HIGHLIGHT_NEARBY,
} from '../../../constants/search';
import BusLineUtil from '../../../utils/arcgis/busline';
import * as jsapi from '../../../utils/jsapi';
import env from '../../../utils/env';
import { synchronizeViews } from '../../../utils/synchronizeView';

const ags = {};
const agstwo = {};
env.setParamAgs(ags);
env.setParamAgstwo(agstwo);
const overmapDiv = {};
// window.agsGlobla = ags;
// 设置全局ags对象，用于其他组件获取其中的view对象 wangfh 20180717 end;

async function prepare() {
  const [esriConfig] = await jsapi.load(['esri/config']);
  esriConfig.request.proxyUrl = env.getProxyUrl();
  esriConfig.portalUrl = env.getPortal();
}

function initMapUtils(store) {
  AgsSearchUtil.instance().view = ags.view;
  AgsSearchUtil.instance().store = store;
}

function createMap(opts = {}) {
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
          // Initialize map
          // initializeMap(basemap);
        } else if (viewMode === VIEW_MODE_3D) {
          await initSceneView();
        }
        // create buttons
        await createToolButtons();
        await create3DToolButtons();
        initMapUtils(store);
        getpoints();
        // When initialized...
        return ags.view.when(() => {
          // Update the environment settings (either from the state or from the scene)
        });
      }
      case ACTION_MAP_OVERVIEW: {
        const visibleOverviewmap = action.payload;
        console.log(visibleOverviewmap);
        if (visibleOverviewmap) {
          overmapDiv.dom.style.display = 'block';
        } else {
          overmapDiv.dom.style.display = 'none';
        }
        break;
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
          // initializeMap(basemap);
          getpoints();
        } else if (payload === VIEW_MODE_3D) {
          const showl = document.getElementById('showl');
          showl.innerHTML = '';
          await initSceneView();
        }
        // create buttons
        await createToolButtons();
        await create3DToolButtons();
        break;
      }
      case MAP_ACTION_CLEAR_GRAPHICS: {
        if (ags.view) {
          ags.view.graphics.removeAll();
        }
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
      case ACTION_MAP_2D_CORRECT: {
        if (store.getState().agsmap.correctflags) {
          store.dispatch({
            type: 'agsmap/mapcorrectChangeState',
            payload: false,
          });
        } else {
          store.dispatch({
            type: 'agsmap/mapcorrectChangeState',
            payload: true,
          });
        }
        break;
      }
      case ACTION_ADDMAPCORRECT_2D: {
        MapCorrect.mapTwoView = ags.view;
        MapCorrect.active('point');
        break;
      }
      case ACTION_ADDBOOKMARK_2D: {
        if (ags.view) {
          const extent = ags.view.extent;
          // 保存
          store.dispatch({
            type: 'agsmap/updateBookmarks',
            payload: [
              ...store.getState().agsmap.bookmarks,
              {
                name: action.payload,
                newextent: extent,
              },
            ],
          });
        }
        break;
      }
      case ACTION_GOTOBOOKMARK_2D: {
        if (ags.view) {
          const bookname = action.payload;
          const books = store.getState().agsmap.bookmarks;
          books.forEach(element => {
            if (element.name === bookname) {
              ags.view.goTo(element.newextent.extent);
            }
          });
        }
        break;
      }
      case ACTION_DELETBOOKMARK_2D: {
        if (ags.view) {
          store.dispatch({
            type: 'agsmap/updateBookmarks',
            payload: [],
          });
        }
        break;
      }
      case ACTION_DELETTHISBOOKMARK_2D: {
        if (ags.view) {
          const bookname = action.payload;
          const books = store.getState().agsmap.bookmarks;
          books.forEach(element => {
            if (element.name === bookname) {
              const index = books.indexOf(element);
              books.splice(index, 1);
            }
          });
          store.dispatch({
            type: 'agsmap/updateBookmarks',
            payload: books,
          });
        }
        break;
      }
      case ACTION_EDITBOOKMARK_2D: {
        if (ags.view) {
          const oldname = action.payload.oldname;
          const newname = action.payload.newname;
          const books = store.getState().agsmap.bookmarks;
          const extent = ags.view.extent;
          const newelement = {
            name: newname,
            newextent: extent,
          };
          books.forEach(element => {
            if (element.name === oldname) {
              const index = books.indexOf(element);
              books.splice(index, 1, newelement);
            }
          });
          store.dispatch({
            type: 'agsmap/updateBookmarks',
            payload: books,
          });
        }
        break;
      }
      case PIN_START: {
        const { payload } = action;
        const { lonlat } = payload;
        const coordArr = lonlat.split(' ');
        if (ags.view) {
          const [Point] = await jsapi.load(['esri/geometry/Point']);
          ags.view.goTo({
            target: new Point({
              x: +coordArr[0],
              y: +coordArr[1],
              spatialReference:
                ags.view.spatialReference.wkid === 102100
                  ? {
                      wkid: 4326,
                    }
                  : ags.view.spatialReference,
            }),
            zoom: 17,
          });
          BusLineUtil.addStartLocation(ags.view, +coordArr[0], +coordArr[1]);
        }
        break;
      }
      case PIN_END: {
        const { payload } = action;
        const { lonlat } = payload;
        const coordArr = lonlat.split(' ');
        if (ags.view) {
          const [Point] = await jsapi.load(['esri/geometry/Point']);
          ags.view.goTo({
            target: new Point({
              x: +coordArr[0],
              y: +coordArr[1],
              spatialReference:
                ags.view.spatialReference.wkid === 102100
                  ? {
                      wkid: 4326,
                    }
                  : ags.view.spatialReference,
            }),
            zoom: 17,
          });
          BusLineUtil.addEndLocation(ags.view, +coordArr[0], +coordArr[1]);
        }
        break;
      }
      case MAP_ACTION_DRAWLINE: {
        const { payload } = action;
        const { segments } = payload;
        BusLineUtil.drawPlanLine(ags.view, segments);

        break;
      }
      case MAP_ACTION_DRAW_DRIVELINE: {
        const { payload } = action;
        BusLineUtil.drawDriveLine(ags.view, payload);
        break;
      }
      case MAP_ACTION_HIGHLIGHT_DRIVE: {
        const { payload } = action;
        if (ags.view) {
          BusLineUtil.highlightDriveSegment(ags.view, payload);
        }
        break;
      }
      case MAP_ACTION_CLEAR: {
        if (ags.view) {
          BusLineUtil.clear(ags.view);
          AgsSearchUtil.instance().clear();
        }
        break;
      }
      case MAP_ACTION_HIGHLIGHT: {
        const { payload } = action;
        if (ags.view) {
          BusLineUtil.highlightSegment(ags.view, payload);
        }
        break;
      }
      case MAP_ACTION_DRAW_POI: {
        const { payload } = action;
        const { result, page } = payload;
        AgsSearchUtil.instance().draw(result, page);
        break;
      }
      case MAP_ACTION_HIGHLIGHT_POI: {
        const { payload } = action;
        AgsSearchUtil.instance().highlight(payload);
        break;
      }
      case MAP_ACTION_CLEAR_HIGHLIGHT_POI: {
        AgsSearchUtil.instance().clearHighlight();
        break;
      }
      case MAP_ACTION_CLEAR_HIGHLIGHT_NEARBY: {
        AgsSearchUtil.instance().clearHighlightNearby();
        break;
      }
      case MAP_ACTION_DRAW_NEARBY: {
        const { point, result, page } = action.payload;
        AgsSearchUtil.instance().drawNearby(point, result, page);
        break;
      }
      case MAP_ACTION_HIGHLIGHT_NEARBY: {
        const { payload } = action;
        AgsSearchUtil.instance().highlightNearby(payload);
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
  const [
    WebMap,
    MapView,
    // GraphicsLayer
  ] = await jsapi.load([
    'esri/WebMap',
    'esri/views/MapView',
    // 'esri/layers/GraphicsLayer',
  ]);
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

  // add poi label feature layer
  // const gl = new GraphicsLayer();
  // const surfaceLayer = new SurfaceLabel(ags.view, gl, store);
  // surfaceLayer.activate();
  // webmap.layers.add(gl);
}

async function initsplitMapView() {
  const [WebMap, MapView, BasemapGallery, watchUtils] = await jsapi.load([
    'esri/WebMap',
    'esri/views/MapView',
    'esri/widgets/BasemapGallery',
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
  const basemapGalleryDiv = document.createElement('div');
  basemapGalleryDiv.style.position = 'absolute';
  basemapGalleryDiv.style.bottom = '-20px';
  basemapGalleryDiv.style.right = '-5px';
  const basemapGallery = new BasemapGallery({
    container: basemapGalleryDiv,
    view: agstwo.view,
  });
  agstwo.view.ui.add(basemapGallery, {
    position: 'bottom-right',
    index: 0,
  });
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

async function create3DToolButtons() {
  // lih 2018-07-20 生成鹰眼dom
  const [domConstruct] = await jsapi.load([
    'dojo/dom-construct',
  ]);
  console.log(11111);
  overmapDiv.dom = domConstruct.create('div');
  ags.view.ui.add(overmapDiv.dom, {
    position: 'bottom-left',
  });
  ReactDOM.render(<Overviewmap view={ags.view} />, overmapDiv.dom);
  overmapDiv.dom.style.display = 'none';
}

function getpoints() {
  const getpointsDiv = document.createElement('div');
  ags.view.ui.add(getpointsDiv, {
    position: 'bottom-left',
  });
  ReactDOM.unmountComponentAtNode(getpointsDiv);
  ReactDOM.render(<Getpoints view={ags.view} />, getpointsDiv);
}

async function createToolButtons() {
  const [domConstruct, BasemapGallery] = await jsapi.load([
    'dojo/dom-construct',
    'esri/widgets/BasemapGallery',
  ]);

  // Home
  // const homeDiv = domConstruct.create('div');
  // ags.view.ui.add(homeDiv, {
  //   position: 'bottom-right',
  // });
  // ReactDOM.render(<Home view={ags.view} />, homeDiv);

  // Zoom
  const zoomDiv = domConstruct.create('div');
  ags.view.ui.add(zoomDiv, {
    position: 'bottom-right',
  });
  ReactDOM.render(<Zoom view={ags.view} />, zoomDiv);

  // Compass
  const compassDiv = domConstruct.create('div');
  ags.view.ui.add(compassDiv, {
    position: 'bottom-right',
  });
  ReactDOM.render(<Compass view={ags.view} />, compassDiv);

  // LayerList
  // const expandDiv = domConstruct.create('div');
  // expandDiv.style.position = 'absolute';
  // expandDiv.style.top = '50px';
  // expandDiv.style.right = '-8px';
  // const layerList = new LayerList({
  //   container: domConstruct.create('div'),
  //   view: ags.view,
  // });
  // ags.view.ui.add(expandDiv, {
  //   position: 'top-right',
  //   index: 0,
  // });
  // ReactDOM.render(
  //   <Expand
  //     view={ags.view}
  //     content={layerList.domNode}
  //     expandIconClass="esri-icon-layers"
  //   />,
  //   expandDiv,
  // );

  // BasemapGallery
  const basemapGalleryDiv = domConstruct.create('div');
  basemapGalleryDiv.style.position = 'absolute';
  basemapGalleryDiv.style.bottom = '-20px';
  basemapGalleryDiv.style.right = '-5px';
  const basemapGallery = new BasemapGallery({
    container: basemapGalleryDiv,
    view: ags.view,
  });
  ags.view.ui.add(basemapGallery, {
    position: 'bottom-right',
    index: 0,
  });
}

export { createMap };
