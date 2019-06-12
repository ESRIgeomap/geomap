import AgsSearchUtil from '../../../utils/arcgis/search';

import {
  PIN_START,
  PIN_END,
  PIN_START_END,
  MAP_ACTION_DRAWLINE,
  MAP_ACTION_DRAW_DRIVELINE,
  MAP_ACTION_DRAW_WALKLINE,
  MAP_ACTION_DRAW_RIDELINE,
  MAP_ACTION_HIGHLIGHT_DRIVE,
  MAP_ACTION_CLEAR,
  MAP_ACTION_HIGHLIGHT,
  MAP_ACTION_DRAW_POI,
  MAP_ACTION_HIGHLIGHT_POI,
  MAP_ACTION_CLEAR_HIGHLIGHT_POI,
  MAP_ACTION_DRAW_NEARBY,
  MAP_ACTION_HIGHLIGHT_NEARBY,
  MAP_ACTION_CLEAR_HIGHLIGHT_NEARBY,
  SEARCH_MILEAGECHART_DATA,
  SEARCH_MILEAGECHART_CLOSE,
} from '../../../constants/search';
import BusLineUtil from '../../../utils/arcgis/busline';
import { jsapi } from '../../../constants/geomap-utils';

import envs from '../../../utils/envs';
// 获取全局ags对象，用于其他组件获取其中的view对象


function search(opts = {}) {
  // Detect if 'createLogger' was passed directly to 'applyMiddleware'.
  if (opts.getState && opts.dispatch) {
    return () => next => action => next(action);
  }

  return store => next => async action => {
    const ags = envs.getParamAgs();
    switch (action.type) {
      case PIN_START: {
        const { payload } = action;
        const { lonlat } = payload;
        const coordArr = lonlat.split(' ');
        if (ags.view) {
          BusLineUtil.addStartLocation(ags.view, +coordArr[0], +coordArr[1]);
        }
        break;
      }
      case PIN_END: {
        const { payload } = action;
        const { lonlat } = payload;
        const coordArr = lonlat.split(' ');
        if (ags.view) {
          BusLineUtil.addEndLocation(ags.view, +coordArr[0], +coordArr[1]);
        }
        break;
      }
      case PIN_START_END: {
        let payload = action.payload;
        const { start, end } = payload;
        if (ags.view) {
          BusLineUtil.zoomToPoints(ags.view, start, end);
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
      case MAP_ACTION_DRAW_WALKLINE: {
        const { payload } = action;
        BusLineUtil.drawWalkLine(ags.view, payload);
        break;
      }
      case MAP_ACTION_DRAW_RIDELINE: {
        const { payload } = action;
        BusLineUtil.drawRideLine(ags.view, payload);
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
      default: {
        next(action);
        break;
      }
    }

    return Promise.resolve();
  };
}

export { search };
